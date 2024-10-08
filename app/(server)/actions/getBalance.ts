'use server'

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getBalance() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return 0;
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  return user?.balance ?? 0;
}