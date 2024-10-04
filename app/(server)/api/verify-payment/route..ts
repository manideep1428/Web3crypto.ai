import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Update the deposit status in the database
      await prisma.deposit.update({
        where: { id: razorpay_order_id },
        data: { 
          status: 'Success',
          amount_paid: await getPaymentAmount(razorpay_payment_id)
        }
      })

      // Update user's balance
      const deposit = await prisma.deposit.findUnique({
        where: { id: razorpay_order_id },
        include: { user: true }
      })

      if (deposit) {
        await prisma.user.update({
          where: { id: deposit.userId },
          data: { balance: { increment: deposit.amount / 100 } } // Convert paise to rupees
        })
      }

      return NextResponse.json({ success: true })
    } else {
      await prisma.deposit.update({
        where: { id: razorpay_order_id },
        data: { status: 'Failed' }
      })
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ success: false, error: 'Failed to verify payment' }, { status: 500 })
  }
}

async function getPaymentAmount(paymentId: string): Promise<number> {
  const razorpay = new (require('razorpay'))({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

  const payment = await razorpay.payments.fetch(paymentId)
  return payment.amount
}