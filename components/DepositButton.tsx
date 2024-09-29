import { HandCoins } from "lucide-react";
import { Button } from "./ui/button";
import AddMoney from "./payment/Stripe";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export default function DepositButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const router = useRouter();
  const { toast } = useToast();

  const changeMessage = (newMessage: string) => {
    setAmount(newMessage);
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount) * 100 }),
      });

      const data = await response.json();

      if (data.id) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: 'Your Company Name',
          description: 'Add Money to Wallet',
          order_id: data.id,
          handler: function (response: any) {
            handleSuccess(response);
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSuccess = async (response: any) => {
    try {
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        toast({
          title: "Success",
          description: `Successfully added ₹${amount} to your wallet!`,
        });
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast({
        title: "Error",
        description: "Payment verification failed. Please contact support.",
        variant: "destructive",
      });
    }
  };

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
        sendAmount={changeMessage}
        isOpen={isOpen}
        handlePayment={handlePayment}
        amount={amount}
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
