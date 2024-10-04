'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HandCoins } from "lucide-react"
import { Button } from "./ui/button"
import AddMoney from "@/components/payment/addAmount"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Loader2 } from "lucide-react"
import axios from "axios"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function DepositButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState("0")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null)
  const router = useRouter()

  const changeAmount = (newAmount: string) => {
    setAmount(newAmount)
  }

  const handlePayment = async (paymentAmount: string) => {
    try {
      const response = await axios.post('/api/create-order', {
        amount: parseFloat(paymentAmount)
      })

      const data = response.data
      console.log(data)

      if (data.success && data.order) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Web3Crypto.ai',
          description: 'Add Money to Wallet',
          order_id: data.order.id,
          handler: function (response: any) {
            handleSuccess(response)
          },
          prefill: {
            name: "Manideep",
            email: 'saimanideep.ch12345@gmail.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
      } else {
        throw new Error(data.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      setVerificationStatus('error')
    }
  }

  const handleSuccess = async (response: any) => {
    setIsVerifying(true)
    try {
      const verifyResponse = await axios.post('/api/verify-payment', response)

      const verifyData = verifyResponse.data

      if (verifyData.success) {
        setVerificationStatus('success')
        setIsOpen(false)
        router.refresh()
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      setVerificationStatus('error')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="text-orange-500 hover:bg-orange-500 hover:text-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <HandCoins className="mr-2 h-4 w-4" />
        Deposit
      </Button>
      <AddMoney
        sendAmount={changeAmount}
        isOpen={isOpen}
        handlePayment={handlePayment}
        amount={amount}
        onClose={() => setIsOpen(false)} 
      />
      <Dialog open={isVerifying || verificationStatus !== null} onOpenChange={() => setVerificationStatus(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isVerifying ? 'Verifying Payment' : verificationStatus === 'success' ? 'Payment Successful' : 'Payment Failed'}
            </DialogTitle>
            <DialogDescription>
              {isVerifying ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait while we verify your payment...
                </div>
              ) : verificationStatus === 'success' ? (
                `Successfully added ₹${amount} to your wallet!`
              ) : (
                "Payment verification failed. Please try again or contact support."
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}