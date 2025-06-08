// app/(pages)/orders/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Package2 } from 'lucide-react';

// Define Order type (assuming structure from original file)
type Order = {
  id: string;
  transactionType: 'Buy' | 'Sell';
  amount: number;
  status: 'Pending' | 'Success' | 'Failed';
  crypto: {
    currency: string;
  };
  // Add other relevant fields if they exist, e.g., date, price
  // For now, focusing on what was in the original render
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/orders'); // Ensure this API route exists and returns Order[]
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-4 md:p-6" // Use page padding
      >
        <Card className="w-full max-w-md p-6 text-center bg-destructive/10 border-destructive shadow-lg">
          <XCircle className="w-12 h-12 mx-auto mb-3 text-destructive" />
          <h2 className="text-xl font-semibold mb-2 text-destructive-foreground">Error Fetching Orders</h2>
          <p className="text-destructive-foreground/80">{error}</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Page Title */}
      <motion.section variants={sectionVariants} initial="visible" animate="visible"> {/* No entry animation for title usually */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Your Orders</h1>
      </motion.section>

      {/* Section 2: Main Orders Display (or Loading/Empty State) */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible" // Animate in once, not on scroll for main content area
        viewport={{ once: true, amount: 0.1 }}
      >
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden border-border">
                <CardHeader className="bg-muted/30 h-[68px] p-4"> {/* Adjusted skeleton header height & padding */}
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="pt-4 p-4 space-y-3"> {/* Adjusted padding & spacing */}
                  <Skeleton className="h-6 w-1/2" /> {/* For amount */}
                  <Skeleton className="h-4 w-full" /> {/* For type/status line */}
                  <Skeleton className="h-4 w-1/4" />   {/* For status badge */}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="w-full max-w-lg mx-auto border-border shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
              <Package2 className="w-16 h-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-3 text-foreground">No Orders Placed</h2>
              <p className="text-muted-foreground">
                You haven't placed any orders yet. Start trading to see your order history here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 border-border bg-card">
                <CardHeader
                  className={`p-4 ${
                    order.transactionType === 'Buy' ? 'bg-primary/5' : 'bg-destructive/5' // Subtle themed backgrounds
                  }`}
                >
                  <CardTitle className="flex items-center justify-between text-lg text-foreground">
                    <span>{order.crypto.currency}</span>
                    <Badge
                      variant={order.transactionType === 'Buy' ? 'default' : 'destructive'}
                      className="capitalize text-xs px-2 py-0.5" // Ensure consistent casing and size
                    >
                      {order.transactionType}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 p-4 space-y-3"> {/* Added space-y-3 */}
                  <div className="flex items-center justify-between mb-2"> {/* Reduced mb from 3 to 2 */}
                    <span className="text-xl font-semibold text-foreground">${order.amount.toFixed(2)}</span>
                    {order.status === 'Success' && <CheckCircle className="text-[hsl(var(--success))] w-5 h-5" />} {/* Adjusted size */}
                    {order.status === 'Failed' && <XCircle className="text-[hsl(var(--destructive))] w-5 h-5" />} {/* Adjusted size */}
                    {order.status === 'Pending' && <Clock className="text-[hsl(var(--warning))] w-5 h-5" />} {/* Adjusted size */}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground"> {/* Added justify-between */}
                    <div className="flex items-center">
                      {order.transactionType === 'Buy' ? (
                        <TrendingUp className="mr-1.5 h-4 w-4 text-[hsl(var(--success))]" />
                      ) : (
                        <TrendingDown className="mr-1.5 h-4 w-4 text-[hsl(var(--destructive))]" />
                      )}
                      <span>{order.transactionType === 'Buy' ? 'Purchased' : 'Sold'}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Success' ? 'bg-success/10 text-[hsl(var(--success))]' :
                      order.status === 'Failed' ? 'bg-destructive/10 text-[hsl(var(--destructive))]' : // Using destructive text directly
                      order.status === 'Pending' ? 'bg-warning/10 text-[hsl(var(--warning))]' : 'bg-muted text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}