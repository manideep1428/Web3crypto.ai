"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import NavSidebar from "@/components/core/sideNavBar"
import CryptoList from "@/components/trade/markets/cryptoPage"

export default function CryptoDashboard() {
  const [isOpen, setIsOpen] = useState(true)
  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div className="relative flex h-screen overflow-hidden">
      <main className="flex-1 overflow-auto p-4">
        <div className="rounded-lg shadow p-6 dark:shadow-amber-50">
          <CryptoList />
        </div>
      </main>
    </div>
  )
}