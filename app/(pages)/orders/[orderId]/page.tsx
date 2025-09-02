'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, XCircle, Clock, Tag, DollarSign, Hash, CalendarDays, UserCircle, Info } from 'lucide-react'

// Define a more detailed Order type for this page
type CryptoDetails = {
  currency: string;
  quantity: number; // Assuming this will be available or calculable
  priceAtTransaction: number;
  transactionFee: number;
  timeOfTransaction: string | null;
};

type UserDetails = {
  name: string | null;
  email: string;
};

type DetailedOrder = {
  id: string;
  transactionType: 'Buy' | 'Sell';
  amount: number; // Total monetary value
  status: 'Pending' | 'Success' | 'Failed';
  createdAt: string; // Or Date object, to be formatted
  cryptoDetails: CryptoDetails;
  userDetails: UserDetails;
  // Potentially add profit/loss if applicable and calculated by API
  // profitLoss?: number;
};

const OrderDetailPage = () => {
  const params = useParams()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<DetailedOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch(`/api/orders/${orderId}`)
          const data = await response.json()

          if (response.ok && data.success) {
            setOrder(data.order)
          } else {
            setError(data.message || 'Failed to fetch order details.')
          }
        } catch (err) {
          console.error('Error fetching order:', err)
          setError('An unexpected error occurred.')
        } finally {
          setLoading(false)
        }
      }
      fetchOrderDetails()
    }
  }, [orderId])

  const getStatusIcon = (status: DetailedOrder['status']) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'Failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'Pending':
        return <Clock className="w-5 h-5 text-orange-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number | null | undefined }) => (
    <div className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm text-gray-500">{value || 'N/A'}</p>
      </div>
    </div>
  );


  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 py-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card className="max-w-md mx-auto bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 mr-2" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
         <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center justify-center">
              <Info className="w-6 h-6 mr-2" /> Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">The requested order could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Helper to format date/time
  const formatDateTime = (dateTimeString: string | null | undefined) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleString();
    } catch (e) {
      return dateTimeString; // fallback if not a valid date string
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className={`border-b ${order.transactionType === 'Buy' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Order Details
            </CardTitle>
            <Badge variant={order.transactionType === 'Buy' ? 'default' : 'destructive'} className="text-sm">
              {order.transactionType}
            </Badge>
          </div>
          <CardDescription className="text-gray-600">
            Order ID: {order.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <DetailItem
              icon={<Tag className="w-5 h-5" />}
              label="Crypto Currency"
              value={order.cryptoDetails.currency}
            />
            <DetailItem
              icon={<DollarSign className="w-5 h-5" />}
              label="Total Amount"
              value={`$${order.amount.toFixed(2)}`}
            />
            <DetailItem
              icon={<Hash className="w-5 h-5" />}
              label="Quantity"
              value={order.cryptoDetails.quantity} // Ensure this is correctly populated by API
            />
            <DetailItem
              icon={<DollarSign className="w-5 h-5" />}
              label="Price at Transaction"
              value={`$${order.cryptoDetails.priceAtTransaction.toFixed(2)}`} // Ensure this is correct
            />
            <DetailItem
              icon={<DollarSign className="w-5 h-5" />}
              label="Transaction Fee"
              value={`$${order.cryptoDetails.transactionFee.toFixed(2)}`}
            />
             <DetailItem
              icon={<CalendarDays className="w-5 h-5" />}
              label="Transaction Time"
              value={formatDateTime(order.cryptoDetails.timeOfTransaction)}
            />
            <DetailItem
              icon={<CalendarDays className="w-5 h-5" />}
              label="Order Placed At"
              value={formatDateTime(order.createdAt)} // This was order.crypto.timeBuyAt in API, might need its own field for order creation
            />
             <div className="md:col-span-2"> {/* Status takes full width on medium screens */}
              <DetailItem
                icon={getStatusIcon(order.status)}
                label="Status"
                value={order.status}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserCircle className="w-5 h-5" />
                <span>Order for: {order.userDetails.name || 'N/A'} ({order.userDetails.email})</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OrderDetailPage
