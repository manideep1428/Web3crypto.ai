import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const emailId = session?.user?.email

  if (!emailId) {
    return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 })
  }

  try {
    const { crypto, amount } = await request.json()

    if (!crypto || !amount) {
      return NextResponse.json({ success: false, message: "Missing crypto or amount" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: emailId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const amountNum:number = amount
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount specified" }, { status: 400 })
    }

    if (user.balance < amountNum) {
      return NextResponse.json({ success: false, message: "Insufficient balance. Please deposit more." }, { status: 400 })
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const cryptoOrder = await tx.crypto.create({
        data: {
          name: crypto,
          buyAt: amount,
          timeBuyAt: new Date().toISOString(),
          transactionFee: (amountNum * 0.2),
        },
      })

      await tx.order.create({
        data: {
          amount,
          status: "Buy",
          userId: user.id,
          cryptoId: cryptoOrder.id,
        },
      })

      await tx.user.update({
        where: { id: user.id },
        data: { balance : { decrement: amountNum } },
      })
    })

    return NextResponse.json({ success: true, message: "Crypto purchased successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "An error occurred. Please try again." }, { status: 500 })
  }
}