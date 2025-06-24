'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Package2, Clock, CalendarDays, Hash } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Order = {
  id: string;
  transactionType: 'Buy' | 'Sell';
  amount: number;
  status: 'Pending' | 'Success' | 'Failed';
  crypto: {
    currency: string;
  };
  createdAt: string; // Assuming API provides this
  pricePerUnit?: number; // Optional: if available
};

// Mock data for development until API is updated
const mockOrders: Order[] = [
  { id: 'ORD001', transactionType: 'Buy', amount: 250.75, status: 'Success', crypto: { currency: 'Bitcoin (BTC)' }, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), pricePerUnit: 40000 },
  { id: 'ORD002', transactionType: 'Sell', amount: 120.00, status: 'Pending', crypto: { currency: 'Ethereum (ETH)' }, createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), pricePerUnit: 2500 },
  { id: 'ORD003', transactionType: 'Buy', amount: 50.50, status: 'Failed', crypto: { currency: 'Solana (SOL)' }, createdAt: new Date(Date.now() - 3600000 * 1).toISOString(), pricePerUnit: 150 },
  { id: 'ORD004', transactionType: 'Buy', amount: 1000.00, status: 'Success', crypto: { currency: 'USDC' }, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), pricePerUnit: 1 },
];

export default function OrderDisplay() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // const response = await fetch('/api/orders');
        // const data = await response.json();
        // if (data.success) {
        //   setOrders(data.orders.map((o: any) => ({ ...o, createdAt: o.createdAt || new Date().toISOString() }))); // Ensure createdAt exists
        // } else {
        //   setError(data.message);
        // }
        // Using mock data for now
        setOrders(mockOrders);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Success': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'destructive';
      default: return 'default';
    }
  };

  const getTransactionTypeClasses = (type: Order['transactionType']) => {
    return type === 'Buy'
      ? {
          icon: <TrendingUp className="mr-1 h-4 w-4 text-green-500" />,
          textClass: 'text-green-600 dark:text-green-400',
          bgClass: 'bg-green-500/10 dark:bg-green-500/20',
          hoverBgClass: 'hover:bg-green-500/20 dark:hover:bg-green-500/30',
        }
      : {
          icon: <TrendingDown className="mr-1 h-4 w-4 text-red-500" />,
          textClass: 'text-red-600 dark:text-red-400',
          bgClass: 'bg-red-500/10 dark:bg-red-500/20',
          hoverBgClass: 'hover:bg-red-500/20 dark:hover:bg-red-500/30',
        };
  };


  if (error) return (
    <Card className="w-full max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-center text-red-600">Error</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
        <p className="text-lg">{error}</p>
        <p className="text-sm text-muted-foreground">Please try refreshing the page or contact support if the issue persists.</p>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="overflow-hidden shadow-lg">
            <CardHeader className="p-4 bg-muted/30">
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-7 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 bg-muted/30">
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto my-8">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Package2 className="w-16 h-16 text-primary mb-5" />
          <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">
           {"It looks like you haven't placed any orders. When you do, they'll show up right here."}
          </p>
          {/* TODO: Add a button/link to the trading page */}
          {/* <Button asChild> <Link href="/trade">Start Trading</Link> </Button> */}
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => {
          const typeStyle = getTransactionTypeClasses(order.transactionType);
          return (
            <Card key={order.id} className={`overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl border-l-4 ${order.transactionType === 'Buy' ? 'border-green-500' : 'border-red-500'}`}>
              <CardHeader className={`p-4 ${typeStyle.bgClass}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className={`text-xl font-bold ${typeStyle.textClass}`}>
                      {order.transactionType} {order.crypto.currency.split(' ')[0]} {/* Show only name e.g. Bitcoin */}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {order.crypto.currency}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status) as any} className="capitalize">
                    {order.status === 'Success' && <CheckCircle className="mr-1 h-3 w-3" />}
                    {order.status === 'Failed' && <XCircle className="mr-1 h-3 w-3" />}
                    {order.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${order.amount.toFixed(2)}</span>
                  <div className={`flex items-center text-sm font-medium ${typeStyle.textClass}`}>
                    {typeStyle.icon}
                    {order.transactionType}
                  </div>
                </div>

                {order.pricePerUnit && (
                  <div className="text-sm text-muted-foreground">
                    Price: ${order.pricePerUnit.toLocaleString()} per {order.crypto.currency.split(' ')[0]}
                  </div>
                )}

                <div className="text-xs text-muted-foreground flex items-center">
                  <Hash className="w-3 h-3 mr-1" />
                  Order ID:
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-1 font-mono cursor-pointer truncate max-w-[100px] inline-block">{order.id}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{order.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
              <CardFooter className="p-3 bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                  <span>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
                {/* Placeholder for potential actions or details link */}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  )
}