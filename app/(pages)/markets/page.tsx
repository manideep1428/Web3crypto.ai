"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import NavSidebar from "@/components/Dashborad"
import CryptoList from "@/components/cryptoPage"

export default function CryptoDashboard() {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <div className="flex h-screen overflow-hidden">
      <NavSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 overflow-auto p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="mb-4 lg:hidden"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="rounded-lg shadow p-6 dark:shadow-amber-50">
          <CryptoList />
        </div>
      </main>
    </div>
  )
}