import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userEmail = session?.user?.email

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Please login to deposit", status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found", status: 404 })
    }

    const { amount } = await req.json()

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid amount", status: 400 })
    }

    const amountInPaise = Math.round(parseFloat(amount) * 100)

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    })

    // Create a new Deposit record in the database
     await prisma.deposit.create({
      data: {
        id: order.id,
        userId: user.id,
        amount: amountInPaise,
        amount_due: order.amount_due,
        amount_paid: order.amount_paid,
        currency: order.currency,
        receipt: order.receipt,
        status: 'Pending',
      }
    })

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
  }
}