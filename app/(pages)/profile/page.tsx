import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileForm from "@/components/account/ProfilePage"
import LivePnLDisplay from "@/components/pnl/LivePnLDisplay" // Import the new component
import { Separator } from "@/components/ui/separator" // For visual separation

export default async function ProfilePage() {
  const session = await getServerSession() // session for server-side checks / initial data
  
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
      emailVerified: true, // Added emailVerified
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <ProfileForm user={user} />
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">Live Portfolio Snapshot</h2>
        {/* LivePnLDisplay is a Client Component, it will handle its own session and data fetching via WebSocket */}
        <LivePnLDisplay />
      </div>
    </div>
  )
}