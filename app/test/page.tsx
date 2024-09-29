'use client'
import PaymentComponent from '@/components/payment/Stripe'
import React from 'react'


export default  function OrderPage() {
  return (
    <div>
    <PaymentComponent onClose={() => console.log('closed')}/>
    </div>
  )
}
