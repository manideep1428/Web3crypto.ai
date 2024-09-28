import OrderDisplay from "@/app/(pages)/orders/page";


export default function OrdersPage() {
  return (
    <div className="container mx-auto py-8">  
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <OrderDisplay />
    </div>
  )
}