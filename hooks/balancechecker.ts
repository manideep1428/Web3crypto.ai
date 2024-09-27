import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";

export default function useBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function getBalance() {
        const session = await getServerSession();
        if (!session?.user?.email) {
          return
        }
        const user = await prisma.user.findUnique({
          where: {
            email: session?.user?.email,
          },
        });
        const balance = user?.amount
        return balance
      }
      getBalance().then((balance) => {
        //@ts-ignore
        setBalance(balance);
        setLoading(false);
      })
    
  }, []);
  return { balance , loading };
}
