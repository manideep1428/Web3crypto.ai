'use client'

'use client'

import { useEffect, useState } from 'react'
import { Appbar } from '@/components/core/Appbar'
import SideNavbar from '@/components/core/sideNavBar'
import { Toast } from '@/components/ui/toast'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageTransitionVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: 15, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function PagesLayout({ // Renamed RootLayout to PagesLayout for clarity
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  useEffect(()=>{
    const innerWidth = window.innerWidth;
    if(innerWidth < 768) {
        setIsOpen(false);
        setIsCollapsed(true);
    }
  }, [])
  
  return (
        <div className="flex flex-col min-h-screen bg-background"> {/* Added bg-background here for safety */}
          <Appbar toggleSidebar={toggleSidebar}/>
          <div className="flex flex-grow pt-16"> {/* This pt-16 is important for Appbar offset */}
            <SideNavbar isOpen={isOpen} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`flex-grow p-4 md:p-6 transition-all duration-300 ${isOpen ? (isCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'}`}
              >
                {children}
              </motion.main>
            </AnimatePresence>
            <Toast/> {/* Toast might need to be outside AnimatePresence if it should persist across page navigations */}
          </div>
        </div>
  )
}