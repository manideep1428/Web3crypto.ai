import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const buf = await req.text()
  const sig = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.error(`❌ Error message: ${errorMessage}`)
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const { userId } = paymentIntent.metadata
      const amount = paymentIntent.amount_received / 100 // convert from cents to dollars

      if (!userId) {
        console.error("❌ No userId in payment intent metadata")
        return NextResponse.json({ error: "No userId in metadata" }, { status: 400 })
      }

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            balance: {
              increment: amount,
            },
          },
        })
        console.log(`💰 Payment successful for user ${userId}. Amount: ${amount}`)
      } catch (error) {
        console.error(`❌ Error updating user balance for userId: ${userId}`, error)
        return NextResponse.json({ error: "Failed to update user balance" }, { status: 500 })
      }
      break
    default:
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
