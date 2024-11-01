'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface Holding {
  id: number
  currency: string
  amount: number
  buyPrice: number
  currentPrice: number
}

export default function TradingPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const { data: session } = useSession()
  const { toast } = useToast()

  const fetchHoldings = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const response = await axios.get('/api/holdings')
        console.log(response.data)
        setHoldings(response.data)
      } catch (error) {
        console.error('Error fetching holdings:', error)
        toast({
          title: "Error",
          description: "Failed to fetch holdings. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [session?.user?.email, toast])

  useEffect(() => {
    fetchHoldings()
  }, [fetchHoldings])

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws')
    setSocket(ws)

    ws.onopen = () => {
      console.log('Connected to Binance WebSocket')
      const subscribeMsg = {
        method: 'SUBSCRIBE',
        params: holdings.map(h => `${h.currency.toLowerCase()}usdt@ticker`),
        id: 1
      }
      ws.send(JSON.stringify(subscribeMsg))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.e === '24hrTicker') {
        setHoldings(prevHoldings => 
          prevHoldings.map(holding => 
            holding.currency.toLowerCase() === data.s.slice(0, -4).toLowerCase()
              ? { ...holding, currentPrice: parseFloat(data.c) }
              : holding
          )
        )
      }
    }

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [holdings])

  const handleSell = async (holdingId: number) => {
    try {
      await axios.post('/api/sell', { holdingId })
      toast({
        title: "Sell order placed",
        description: "Your sell order has been successfully placed.",
      })
      fetchHoldings()
    } catch (error) {
      console.error('Error placing sell order:', error)
      toast({
        title: "Error",
        description: "Failed to place sell order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const calculatePercentChange = (buyPrice: number, currentPrice: number) => {
    return ((currentPrice - buyPrice) / buyPrice) * 100
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Crypto Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Buy Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Profit/Loss</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const percentChange = calculatePercentChange(holding.buyPrice, holding.currentPrice)
                const isProfit = percentChange >= 0
                return (
                  <TableRow key={holding.id}>
                    <TableCell>{holding.currency}</TableCell>
                    <TableCell>{holding.amount.toFixed(8)}</TableCell>
                    <TableCell>${holding.buyPrice.toFixed(2)}</TableCell>
                    <TableCell>${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className={isProfit ? 'text-green-500' : 'text-red-500'}>
                      {isProfit ? <ArrowUpIcon className="inline mr-1" /> : <ArrowDownIcon className="inline mr-1" />}
                      {Math.abs(percentChange).toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleSell(holding.id)} variant="destructive">
                        Sell
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}