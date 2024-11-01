import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileForm from "@/components/account/ProfilePage"

export default async function ProfilePage() {
  const session = await getServerSession()
  
  if (!session || !session.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <ProfileForm user={user} />
    </div>
  )
}