'use client'

import { useState, useEffect } from "react";
import { getBalance } from "@/app/(server)/actions/getBalance";

export default function useBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBalance().then((balance) => {
      setBalance(balance);
      setLoading(false);
    });
  }, []);

  return { balance, loading };
}