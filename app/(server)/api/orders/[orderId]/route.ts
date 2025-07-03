import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
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

    const orderId = params.orderId;
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        crypto: true, // Include all crypto details
        user: { // Optionally include some user details if needed on the order page
          select: {
            name: true,
            email: true,
          }
        }
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to view this order" },
        { status: 403 }
      );
    }

    // Calculate quantity and determine price at transaction
    let priceAtTransaction = 0;
    let quantity = 0;

    if (order.transactionType === "Buy") {
      priceAtTransaction = order.crypto.buyAt;
      if (priceAtTransaction > 0) {
        quantity = order.amount / priceAtTransaction;
      }
    } else if (order.transactionType === "Sell") {
      if (order.crypto.soldAt) { // soldAt can be null
        priceAtTransaction = order.crypto.soldAt;
        if (priceAtTransaction > 0) {
          quantity = order.amount / priceAtTransaction;
        }
      } else {
        // This case should ideally not happen for a 'Sell' order if data is consistent
        // Or it implies the sell order is about a crypto that hasn't been marked as sold yet in the Crypto table
        // which might be an order in 'Pending' or 'Failed' state.
        priceAtTransaction = 0; // Or some other indicator of missing sell price
      }
    }

    // It's usually better to store Order creation time on the Order model itself.
    // Using crypto.timeBuyAt or timeSoldAt as a proxy for order creation time might be inaccurate.
    // For now, we'll use what's available from the Crypto record.
    // A dedicated `createdAt` field on the `Order` model would be ideal.
    // The current Order model in schema.prisma does not have its own createdAt field.
    // Let's assume the order time is the transaction time recorded in the Crypto table.

    const transformedOrder = {
      id: order.id,
      transactionType: order.transactionType,
      amount: order.amount,
      status: order.status,
      // createdAt: order.createdAt, // Ideal: if Order model had its own createdAt
      createdAt: order.transactionType === 'Buy' ? order.crypto.timeBuyAt : order.crypto.timeSoldAt, // Proxy
      cryptoDetails: {
        currency: order.crypto.currency,
        quantity: quantity,
        priceAtTransaction: priceAtTransaction,
        transactionFee: order.crypto.transactionFee, // This seems to be per crypto lot, not per order.
                                                      // If an order can be partial, this might need refinement.
        timeOfTransaction: order.transactionType === 'Buy' ? order.crypto.timeBuyAt : order.crypto.timeSoldAt,
      },
      userDetails: { // Ensure userDetails are included as defined in the query
        name: order.user?.name,
        email: order.user?.email
      }
    };

    return NextResponse.json(
      { success: true, order: transformedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching order details." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
