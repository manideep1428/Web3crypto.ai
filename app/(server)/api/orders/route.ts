import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        crypto: {
          select: {
            currency: true,
          },
        },
      },
    });

    const transformedOrders = orders.map(order => ({
      id: order.id,
      transactionType: order.transactionType,
      amount: order.amount,
      status: order.status,
      crypto: {
        currency: order.crypto?.currency || 'Unknown',
      },
    }));

    return NextResponse.json(
      { success: true, orders: transformedOrders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching orders." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}