'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface OrderDialogProps {
  isOpen: boolean
  onClose: () => void
  type: 'buy' | 'sell'
  crypto: string
  amount: string
  price: string
}

export default function OrderDialog({ isOpen, onClose, type, crypto, amount, price }: OrderDialogProps) {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4 md:bottom-4 md:right-4 md:left-auto md:w-96"
        >
          <div className={`rounded-lg shadow-lg ${type === 'buy' ? 'bg-green-500' : 'bg-red-500'} text-white p-4`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Order {type === 'buy' ? 'Placed' : 'Sold'}</h3>
              <button onClick={handleClose} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <p className="mb-2">
              You have successfully {type === 'buy' ? 'placed a buy order' : 'sold'} for {amount} {crypto} at {price} USD.
            </p>
            <button
              onClick={() => {/* Navigate to order details */}}
              className="text-sm underline hover:text-gray-200"
            >
              View Details
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}