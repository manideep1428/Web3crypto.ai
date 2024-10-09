'use client'

import { useState } from 'react'
import useBalance from "@/hooks/balancechecker"
import { Wallet, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function WalletButton() {
  const { loading, balance } = useBalance()
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')

  const handleAddMoney = () => {
    // Implement your add money logic here
    console.log(`Adding $${amount}`)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Wallet className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden md:inline text-sm font-medium">
            {loading ? "Loading..." : `$${balance.toFixed(2)}`}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Wallet</DialogTitle>
          <DialogDescription>
            Current balance: ${loading ? "..." : balance.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="Enter amount to add"
            />
          </div>
        </div>
        <Button onClick={handleAddMoney} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Money
        </Button>
      </DialogContent>
    </Dialog>
  )
}