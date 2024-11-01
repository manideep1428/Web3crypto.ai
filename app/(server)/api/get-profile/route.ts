import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return new Response(JSON.stringify({ message: "User not authenticated" }), {
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      id: true,
    },
  });

  return new Response(JSON.stringify(user), {
    status: 200
  })
}
