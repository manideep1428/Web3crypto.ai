import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const emailId = session?.user?.email;

  if (!emailId) {
    return NextResponse.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  let result = null;

  try {
    const { market , price , marketPrice } = await request.json();
     const crypto = market 
     const  amount = Number(price)
    if (!crypto || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing crypto or amount" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: emailId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const amountNum: number = amount;
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount specified" },
        { status: 400 }
      );
    }

    if (user.balance < amountNum) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient balance. Please deposit more.",
        },
        { status: 400 }
      );
    }

    result = await prisma.$transaction(async (tx) => {
      const cryptoOrder = await tx.crypto.create({
        data: {
          userId: user.id,
          currency: crypto,
          buyAt: Number(marketPrice) - Number(marketPrice * 0.02)  ,
          timeBuyAt: new Date().toISOString(),
          transactionFee: amountNum * 0.2,
          soldAt: 0,
        },
      });

      const newOrder = await tx.order.create({
        data: {
          amount,
          status: "Pending", 
          userId: user.id,
          cryptoId: cryptoOrder.id,
          transactionType : "Buy"
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amountNum } },
      });

      return { newOrder, cryptoOrder }; 
    });

    await prisma.order.update({
      where: { id: result.newOrder.id },
      data: { status: "Success" },
    });

    return NextResponse.json(
      { success: true, message: "Crypto purchased successfully", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    
    if (result?.newOrder?.id) {
      await prisma.order.update({
        where: { id: result.newOrder.id },
        data: { status: "Failed" },
      });
    }

    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
