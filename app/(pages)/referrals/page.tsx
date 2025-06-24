'use client'

import { GiftIcon, UsersIcon, CopyIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function ReferralsPage() {
  const { toast } = useToast()
  const referralLink = "https://yourapp.com/referral?code=USER123XYZ" // Example referral link
  const referredUsers = [
    // Example data, replace with actual data fetching
    // { id: 1, name: "Alice B.", status: "Joined", reward: "$5" },
    // { id: 2, name: "Bob C.", status: "Pending", reward: "$5" },
  ]
  const rewardsEarned = 0 // Example data

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Your referral link has been copied.",
      })
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      })
      console.error('Failed to copy text: ', err)
    })
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <GiftIcon className="w-6 h-6 mr-2 text-primary" />
            Invite Friends, Earn Rewards!
          </CardTitle>
          <CardDescription>
            Share your unique referral link with friends. When they sign up and trade, you both get rewarded!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="referralLink" className="block text-sm font-medium text-muted-foreground mb-1">
              Your Unique Referral Link
            </label>
            <div className="flex space-x-2">
              <Input id="referralLink" type="text" value={referralLink} readOnly className="bg-muted/40" />
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                <CopyIcon className="w-4 h-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Rewards Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">${rewardsEarned.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Keep sharing to earn more!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Friends Referred</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{referredUsers.length}</p>
                <p className="text-xs text-muted-foreground">
                  {referredUsers.length > 0 ? "Great job!" : "Invite your first friend!"}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UsersIcon className="w-5 h-5 mr-2" />
            Your Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">You haven't referred anyone yet.</p>
              <p className="text-sm text-muted-foreground">Share your link to start earning rewards.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {/* Placeholder for list of referred users - map through 'referredUsers' here */}
              {/* Example list item:
              <li className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Alice B.</p>
                  <p className="text-sm text-muted-foreground">Status: Joined</p>
                </div>
                <p className="text-green-600 font-semibold">Reward: $5</p>
              </li>
              */}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
