'use client'

import useBalance from "@/hooks/balancechecker";
import { Wallet } from "lucide-react";

export default function Walletbutton() {
  const { loading, balance } = useBalance();

  return (
    <div className="flex gap-2 justify-center items-center text-black px-3 py-2 rounded-lg bg-white border-2 border-black hover:cursor-pointer">
      <Wallet size={20} />
      <p className="text-sm font-medium">
        {loading ? "Loading..." : `$${balance.toFixed(2)}`}
      </p>
    </div>
  );
}