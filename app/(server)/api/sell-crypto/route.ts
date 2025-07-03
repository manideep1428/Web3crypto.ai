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

  try {
    const { cryptoId, sellPrice } = await request.json(); // Expect cryptoId (of the holding) and current sellPrice

    if (!cryptoId || typeof sellPrice !== 'number' || sellPrice <= 0) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid cryptoId or sellPrice" },
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

    // Fetch the specific crypto holding
    const cryptoToSell = await prisma.crypto.findUnique({
      where: { id: cryptoId, userId: user.id },
    });

    if (!cryptoToSell) {
      return NextResponse.json(
        { success: false, message: "Crypto holding not found or does not belong to user." },
        { status: 404 }
      );
    }

    if (cryptoToSell.soldAt !== null) {
      return NextResponse.json(
        { success: false, message: "This crypto holding has already been sold." },
        { status: 400 }
      );
    }

    // Find the original "Buy" order to determine quantity
    // This assumes one "Buy" order per Crypto entry. If a Crypto entry could be from multiple buys, this is more complex.
    const originalBuyOrder = await prisma.order.findFirst({
        where: {
            cryptoId: cryptoToSell.id,
            transactionType: "Buy",
            userId: user.id // Ensure it's the user's order
        },
        // Optional: orderBy: { createdAt: 'asc' } if multiple buy orders could somehow link to one cryptoId (unlikely with current schema)
    });

    if (!originalBuyOrder) {
        // This indicates a data consistency issue or that the Crypto entry was created without a corresponding Buy order.
        return NextResponse.json(
            { success: false, message: "Could not find original purchase order for this crypto holding. Cannot determine quantity." },
            { status: 500 } // Internal server error due to data inconsistency
        );
    }

    // Calculate quantity: Original total cost / original price per unit
    // Ensure buyAt is not zero to avoid division by zero
    if (cryptoToSell.buyAt <= 0) {
        return NextResponse.json(
            { success: false, message: "Invalid purchase price for the crypto holding. Cannot determine quantity." },
            { status: 500 }
        );
    }
    const quantity = originalBuyOrder.amount / cryptoToSell.buyAt;

    if (quantity <= 0) {
        return NextResponse.json(
            { success: false, message: "Calculated quantity is zero or negative. Cannot sell." },
            { status:400 }
        );
    }

    const totalProceeds = quantity * sellPrice;

    // Perform the sale within a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the Crypto record
      const updatedCrypto = await tx.crypto.update({
        where: { id: cryptoToSell.id },
        data: {
          soldAt: Math.round(sellPrice), // Store sell price (assuming Int in schema, round if necessary)
          timeSoldAt: new Date().toISOString(),
        },
      });

      // 2. Create a new "Sell" Order
      const newSellOrder = await tx.order.create({
        data: {
          userId: user.id,
          cryptoId: cryptoToSell.id,
          amount: Math.round(totalProceeds), // Store total proceeds (assuming Int)
          transactionType: "Sell",
          status: "Success", // Assuming immediate success for this example
        },
      });

      // 3. Update user's balance
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          balance: {
            increment: Math.round(totalProceeds), // Add proceeds to balance
          },
        },
      });

      return { updatedCrypto, newSellOrder, updatedUser };
    });

    return NextResponse.json(
      {
        success: true,
        message: `${cryptoToSell.currency} sold successfully. Quantity: ${quantity.toFixed(8)} at $${sellPrice.toFixed(2)}. Total: $${totalProceeds.toFixed(2)}.`,
        data: {
            orderId: result.newSellOrder.id,
            cryptoId: result.updatedCrypto.id,
            newBalance: result.updatedUser.balance,
            quantitySold: quantity,
            totalProceeds: totalProceeds
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error selling crypto:", error);
    // No specific order to mark as 'Failed' here as it's created as 'Success' or transaction fails.
    return NextResponse.json(
      { success: false, message: "An error occurred during the sell operation. Please try again." },
      { status: 500 }
    );
  }
}
