'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Package2, Clock } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

type Order = {
  id: string
  transactionType: 'Buy' | 'Sell'
  amount: number
  status: 'Pending' | 'Success' | 'Failed'
  crypto: {
    currency: string
  }
}

export default function OrderDisplay() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (error) return (
    <div className="text-center p-4 bg-red-100 text-red-800 rounded-md">
      <XCircle className="w-6 h-6 mx-auto mb-2" />
      <p>{error}</p>
    </div>
  )

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-primary">
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="pt-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Package2 className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Placed</h2>
          <p className="text-center text-muted-foreground">
           {" You haven't placed any orders yet. Start trading to see your order history here."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className={`${order.transactionType === 'Buy' ? 'bg-green-100' : 'bg-red-100'} text-foreground`}>
            <CardTitle className="flex items-center justify-between">
              <span>{order.crypto.currency}</span>
              <Badge variant={order.transactionType === 'Buy' ? 'default' : 'secondary'}>
                {order.transactionType}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold">${order.amount.toFixed(2)}</span>
              {order.status === 'Success' && <CheckCircle className="text-green-500 w-5 h-5" />}
              {order.status === 'Failed' && <XCircle className="text-red-500 w-5 h-5" />}
              {order.status === 'Pending' && <Clock className="text-yellow-500 w-5 h-5" />}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {order.transactionType === 'Buy' ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span>{order.transactionType === 'Buy' ? 'Bought' : 'Sold'}</span>
              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                {order.status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}