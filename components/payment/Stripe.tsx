import { useState, useEffect } from 'react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DepositProps {
  isOpen: boolean;
  handlePayment: () => void;
  sendAmount: (amount: string) => void;
  amount: string;
  onClose: () => void; // New prop for closing the sheet
}

export default function AddMoney({ isOpen, handlePayment, sendAmount, amount, onClose }: DepositProps) {
  const [localAmount, setLocalAmount] = useState(amount);

  useEffect(() => {
    setLocalAmount(amount); // Sync local state with parent state
  }, [amount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAmount(value); // Update local input state
    sendAmount(value); // Send the updated value to parent
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}> {/* Automatically close the sheet when onClose is called */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Money to Wallet</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="amount"
              type="number"
              value={localAmount}
              onChange={handleChange} // Call handleChange on input change
              placeholder="Enter amount"
              className="col-span-3"
            />
            <Button onClick={handlePayment} disabled={!localAmount || parseFloat(localAmount) <= 0}>
              Pay
            </Button>
          </div>
        </div>
        <SheetClose asChild>
          <Button variant="ghost" className="w-full justify-center" onClick={onClose}>
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
