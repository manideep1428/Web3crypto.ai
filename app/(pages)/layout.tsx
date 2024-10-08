'use client'

import { useEffect, useState } from 'react'
import { Appbar } from '@/components/core/Appbar'
import SideNavbar from '@/components/core/sideNavBar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleSidebar = () => setIsOpen(!isOpen)
  
  useEffect(()=>{
  const innerWidth = window.innerWidth
  
  if(innerWidth > 768) {
      setIsOpen(true)
  }
  }, [innerWidth])
  
  return (
      <html lang="en" suppressHydrationWarning>
        <body className="flex flex-col min-h-screen">
          <div className='fixed top-0 left-0 w-full z-50'>
            <Appbar toggleSidebar={toggleSidebar}/>
          </div>
          <div className="flex flex-grow pt-16">
            <SideNavbar isOpen={isOpen} />
            <main className={`flex-grow p-4 transition-all duration-300 ${isOpen ? 'ml-[240px]' : ''}`}>
              {children}
            </main>
          </div>
        </body>
      </html>
  )
}