import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, DollarSign } from 'lucide-react'

interface DepositProps {
  isOpen: boolean;
  handlePayment: (amount: string) => void;
  sendAmount: (amount: string) => void;
  amount: string;
  onClose: () => void;
}

export default function AddMoney({ isOpen, handlePayment, sendAmount, amount, onClose }: DepositProps) {
  const [localAmount, setLocalAmount] = useState(amount)
  const [usdtAmount, setUsdtAmount] = useState('0')

  useEffect(() => {
    setLocalAmount(amount)
    updateUsdtAmount(amount)
  }, [amount])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalAmount(value)
    sendAmount(value)
    updateUsdtAmount(value)
  }

  const updateUsdtAmount = (value: string) => {
    const numValue = parseFloat(value)
    setUsdtAmount(isNaN(numValue) ? '0' : (numValue * 10).toFixed(2))
  }

  const handlePaymentClick = () => {
    handlePayment(localAmount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Money to Wallet</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Enter Amount
                  </label>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="amount"
                    type="number"
                    value={localAmount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="col-span-3"
                  />
                  <Button onClick={handlePaymentClick} disabled={!localAmount || parseFloat(localAmount) <= 0} className="w-full">
                    Pay
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  You will receive: <span className="font-semibold text-foreground">{usdtAmount} USDT</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              1 deposit unit is equal to 10 USDT. Minimum deposit: 10 USDT.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
        <DialogClose asChild>
          <Button variant="outline" className="mt-6 w-full" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}