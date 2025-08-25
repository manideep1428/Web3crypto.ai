'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()

  const [amount, setAmount] = useState('10') // Default to 10 as a minimum
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const createPaymentIntent = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) * 100 }), // amount in cents
      })

      const data = await res.json()

      if (res.status !== 200) {
        setErrorMessage(data.error || 'Failed to create payment intent.')
        setLoading(false)
        return
      }

      setClientSecret(data.clientSecret)
    } catch (error) {
      setErrorMessage('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (!stripe || !elements || !clientSecret) {
      setErrorMessage("Stripe.js has not loaded yet or client secret is missing.")
      setLoading(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/profile`,
        receipt_email: session?.user?.email ?? undefined,
      },
    })

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-4 mb-8">
        <label htmlFor="amount" className="block text-sm font-medium">Amount (USD)</label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          className="mt-1"
          min="10"
        />
        <Button onClick={createPaymentIntent} disabled={loading || parseFloat(amount) < 10} className="w-full">
          {loading ? "Getting ready..." : "Proceed to Payment"}
        </Button>
      </div>

      {clientSecret && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button type="submit" disabled={!stripe || loading} className="w-full">
            {loading ? "Processing..." : `Pay $${amount}`}
          </Button>
          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </form>
      )}
    </div>
  )
}

export function StripePaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
