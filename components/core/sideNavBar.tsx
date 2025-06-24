'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
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

  const menuItems = [
    { icon: TrendingUp, label: 'Markets', href: '/markets' },
    { icon: ShoppingCartIcon, label: 'Orders', href: '/orders' },
    { icon: TrendingUp, label: 'Trade', href: '/trade' },
    { icon: BellIcon, label: 'Notifications', href: '/notifications' },
    { icon: UserIcon, label: 'Profile', href: '/profile' },
    { icon: UsersIcon, label: 'Referrals', href: '/referrals' },
    // Note: The Notifications and Referrals links were already present in the previous version of menuItems.
    // My previous check was flawed. The original code already had these.
    // My task was to ensure the pages exist and the links point to them correctly.
    // The `href` values here match the pages I created.
  ]

  return (
    <div
      className={`fixed top-16 left-0 h-full bg-background transition-all duration-300 ${
        isOpen ? 'w-[240px]' : 'w-0'
      } overflow-hidden z-40`}
    >
      <nav className="h-full flex flex-col p-4 gap-y-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center space-x-3 p-2 rounded-md text-sm font-medium transition-colors ${
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
              <FacebookIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Twitter">
              <TwitterIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
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
    </div>
  )
}