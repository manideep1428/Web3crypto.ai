import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})


export async function POST(req: Request) {
  try {
    const session =  await getServerSession(authOptions)
    const user  = session?.user?.email
    if(!user) {
      return NextResponse.json({sucess : false , message: "Please login to deposit" , status : 404})
    }
    const user1 =    await prisma.user.findFirst({
      where:{
        email: user
      }
    })
    console.log("Req Came here")
    const { amount } = await req.json()
   
    const order = await razorpay.orders.create({
      amount: amount * 100 ,
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    })
    console.log('Order created:' , order)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}