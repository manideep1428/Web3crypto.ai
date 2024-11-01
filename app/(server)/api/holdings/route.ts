import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        crypto: {
          where: { soldAt: null },
          include: {
            orders: {
              where: {
                status: 'Success'
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const holdings = user.crypto.map(crypto => {
      const totalBought = crypto.orders
        .filter(order => order.transactionType === 'Buy')
        .reduce((sum, order) => sum + order.amount, 0)
      
      const totalSold = crypto.orders
        .filter(order => order.transactionType === 'Sell')
        .reduce((sum, order) => sum + order.amount, 0)

      const currentAmount = totalBought - totalSold

      return {
        id: crypto.id,
        currency: crypto.currency,
        amount: currentAmount / 100000000,
        buyPrice: crypto.buyAt / 100,
        currentPrice: 0, 
      }
    }).filter(holding => holding.amount > 0)
    console.log(holdings);
    return NextResponse.json(holdings)
  } catch (error) {
    console.error('Error fetching holdings:', error)
    return NextResponse.json({ error: "Failed to fetch holdings" }, { status: 500 })
  }
}