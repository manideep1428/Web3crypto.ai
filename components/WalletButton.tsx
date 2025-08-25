'use client'

import useBalance from "@/hooks/balancechecker"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function WalletButton() {
  const { loading, balance } = useBalance()
  const pathname = usePathname()

  // Don't show the button on the payment page
  if (pathname === "/payment") {
    return null
  }

  return (
    <Link href="/payment">
      <Button variant="outline" className="flex gap-2 items-center">
        <Wallet className="h-4 w-4 md:h-5 md:w-5" />
        <span className="hidden md:inline text-sm font-medium">
          {loading ? "Loading..." : `$${balance.toFixed(2)}`}
        </span>
      </Button>
    </Link>
  )
}