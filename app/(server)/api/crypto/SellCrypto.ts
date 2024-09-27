"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function sellCrypto(crypto: string, amount: string) {
  const session = await getServerSession();
  if (!session?.user?.email) return new Error("Not LoggedIn");

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    return new Error("User Not Found");
  }
  const userCrypto = await prisma.crypto.findFirst({
    where: {
      //@ts-ignore
      email: session.user?.email,
      name: crypto,
    },
  });

  if (!userCrypto) {
    return new Error("Crypto not found in your wallet");
  }

  const cryptoAmount = parseFloat(userCrypto.amount!);
  const amountNum = parseFloat(amount!);

  if (cryptoAmount < amountNum) {
    return new Error("Insufficient crypto amount to sell.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.crypto.update({
      where: {
        id: userCrypto.id,
      },
      data: {
        amount: (cryptoAmount - amountNum).toString(),
        soldAt: Date.now().toString(),
      },
    });

    await tx.order.create({
      data: {
        //@ts-ignore
        userId: session?.user?.email,
        cryptoId: userCrypto.id,
        amount: amountNum.toString(),
        status: "Sell",
      },
    });
  });

  return "Done";
}
