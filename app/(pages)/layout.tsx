'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import NavSidebar from '@/components/core/Dashborad'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          <NavSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-background border-b">
              <div className="flex items-center justify-between p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-6 w-6" />
                 </Button>
           
              </div>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
              <div className="container mx-auto py-6 px-4">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}