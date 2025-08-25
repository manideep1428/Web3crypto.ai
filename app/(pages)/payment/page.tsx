import { StripePaymentForm } from "@/components/payment/StripePaymentForm";

export default function PaymentPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add Funds to Your Account</h1>
      <StripePaymentForm />
    </div>
  );
}
