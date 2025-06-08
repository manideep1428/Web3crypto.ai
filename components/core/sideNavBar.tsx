'use client'

'use client' // Already present

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion' // Import motion
import {
  ShoppingCartIcon,
  BellIcon,
  LogOutIcon,
  UserIcon,
  UsersIcon,
  FacebookIcon,
  TwitterIcon,
  MoonIcon,
  SunIcon,
  TrendingUp,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface SideNavbarProps {
  isOpen: boolean
}

export default function SideNavbar({ isOpen }: SideNavbarProps) {
  const { theme, setTheme } = useTheme()
  const pathName = usePathname()

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0.95 }, // Slide out completely, slight opacity for effect
  };

  const menuItems = [
    { icon: TrendingUp, label: 'Markets', href: '/markets' },
    { icon: ShoppingCartIcon, label: 'Orders', href: '/orders' },
    { icon: ShoppingCartIcon, label: 'My Trading', href: '/trading' },
    { icon: BellIcon, label: 'Notifications', href: '/notifications' },
    { icon: UserIcon, label: 'Profile', href: '/profile' },
    { icon: UsersIcon, label: 'Referrals', href: '/referrals' },
  ]

  return (
    <motion.div
      variants={sidebarVariants}
      initial={false} // isOpen prop will control the first animation
      animate={isOpen ? "open" : "closed"}
      transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background w-[240px] overflow-y-auto z-40 border-r border-border" // Removed dynamic width, added static width, border, and h-screen offset by appbar (top-16 which is 4rem)
    >
      <nav className="h-full flex flex-col p-4 gap-y-1 w-[240px]"> {/* Ensured nav has width */}
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center space-x-3 p-2 rounded-md text-sm font-medium transition-colors duration-200 ${ // Added duration-200
              pathName === item.href
                ? 'bg-primary/10 text-primary font-semibold' // Active state
                : 'text-muted-foreground hover:bg-primary/5 hover:text-primary' // Inactive state
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="mt-auto space-y-1 px-2 pb-2">
          <h4 className="px-2 pt-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
            Social Connect
          </h4>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" aria-label="Facebook">
              <FacebookIcon className="h-5 w-5 text-muted-foreground" /> {/* Removed hover:text-primary */}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Twitter">
              <TwitterIcon className="h-5 w-5 text-muted-foreground" /> {/* Removed hover:text-primary */}
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full justify-start flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 p-2"
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => console.log('Logout triggered via console')}
            className="w-full justify-start flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 p-2"
          >
            <LogOutIcon className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </nav>
    </motion.div>
  )
}