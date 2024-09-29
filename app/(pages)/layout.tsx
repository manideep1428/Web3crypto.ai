'use client'

import { useState } from 'react'
import { Appbar } from '@/components/core/Appbar'
import { MenuIcon } from 'lucide-react'
import SideNavbar from '@/components/core/sideNavBar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
      <html lang="en" suppressHydrationWarning>
        <body className="flex flex-col min-h-screen">
          <div className='fixed top-0 left-0 w-full z-50'>
            <Appbar />
          </div>
          <div className="flex flex-grow pt-16">
            <SideNavbar isOpen={isOpen} />
            <main className={`flex-grow p-4 transition-all duration-300 ${isOpen ? 'ml-[240px]' : ''}`}>
              <button
                className="fixed top-20 left-4 z-40 p-2 bg-background border rounded-md"
                onClick={toggleSidebar}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              {children}
            </main>
          </div>
        </body>
      </html>
  )
}