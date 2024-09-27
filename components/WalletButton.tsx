'use client'
import { Wallet } from "lucide-react";
import useBalance from "@/hooks/balancechecker";

export default function Walletbutton() {
  const { loading , balance } = useBalance()
  return (
    <div className="flex gap-2 justify-center items-center text-black px-3 rounded-lg bg-white border-2 border-black hover:cursor-pointer">
      <Wallet />
      <p>{loading ? "Loading" : balance} </p>
    </div>
  );
}
