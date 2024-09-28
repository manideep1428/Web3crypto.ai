import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const emailId = session?.user?.email;

  if (!emailId) {
    return NextResponse.json(
      { success: false, message: "Not logged in" },
      { status: 401 }
    );
  }

  let result = null; 

  try {
    const { market, price , marketPrice } = await request.json();
     const crypto = market
     const amount = price
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

    const userCrypto = await prisma.crypto.findFirst({
      where: {
        userId: user.id,
        currency: crypto,
      },
    });

    if (!userCrypto) {
      return NextResponse.json(
        { success: false, message: `${crypto} not found in your wallet` },
        { status: 404 }
      );
    }

    const cryptoAmount = userCrypto.buyAt;
    const amountNum = marketPrice * 0.99;

    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount specified" },
        { status: 400 }
      );
    }

    if (cryptoAmount < amountNum) {
      return NextResponse.json(
        { success: false, message: `Insufficient ${crypto} amount to sell` },
        { status: 400 }
      );
    }

    result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          cryptoId: userCrypto.id,
          amount: amountNum,
          transactionType: "Sell",
          status: "Pending",
        },
      });

      const updatedCrypto = await tx.crypto.update({
        where: { id: userCrypto.id },
        data: {
          buyAt: cryptoAmount - amountNum,
          soldAt: userCrypto.soldAt ? userCrypto.soldAt + amountNum : amountNum,
          timeSoldAt: new Date().toISOString(),
        },
      });

      return { newOrder, updatedCrypto };
    });

    await prisma.order.update({
      where: { id: result.newOrder.id },
      data: { status: "Success" },
    });

    return NextResponse.json(
      { success: true, message: `${crypto} sold successfully`, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    // Check if result is not null and if newOrder exists
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
