'use client'

import { useEffect, useState } from 'react'
import { Appbar } from '@/components/core/Appbar'
import SideNavbar from '@/components/core/sideNavBar'
import { Toast } from '@/components/ui/toast'

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
  }, [])
  
  return (
        <div className="flex flex-col min-h-screen">
          <Appbar toggleSidebar={toggleSidebar}/>
          <div className="flex flex-grow pt-16">
            <SideNavbar isOpen={isOpen} />
            <div className={`flex-grow p-4 transition-all duration-300 ${isOpen ? 'ml-[240px]' : ''}`}>
              {children}
            </div>
            <Toast/>
          </div>
        </div>
  )
}