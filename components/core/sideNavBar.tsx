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
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SideNavbarProps {
  isOpen: boolean
  isCollapsed: boolean
  toggleCollapse: () => void
}

export default function SideNavbar({ isOpen, isCollapsed, toggleCollapse }: SideNavbarProps) {
  const { theme, setTheme } = useTheme()
  const pathName = usePathname()

  const menuItems = [
    { icon: TrendingUp, label: 'Markets', href: '/markets' },
    { icon: ShoppingCartIcon, label: 'Orders', href: '/orders' },
    { icon: ShoppingCartIcon, label: 'My Trading', href: '/trading' },
    { icon: BellIcon, label: 'Notifications', href: '/notifications' },
    { icon: UserIcon, label: 'Profile', href: '/profile' },
    { icon: UsersIcon, label: 'Referrals', href: '/referrals' },
  ]

  return (
    <div
      className={`fixed top-16 left-0 h-full bg-background transition-all duration-300 ${
        isOpen ? (isCollapsed ? 'w-20' : 'w-64') : 'w-0'
      } overflow-hidden z-40 border-r`}
    >
      <TooltipProvider>
        <nav className="h-full flex flex-col p-2 gap-y-1">
          {menuItems.map((item, index) => (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-md text-sm font-medium transition-colors ${
                    pathName === item.href
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
          <div className="mt-auto space-y-1">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`w-full justify-start flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 p-3 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                  {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</p>
                </TooltipContent>
              )}
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => console.log('Logout triggered via console')}
                  className={`w-full justify-start flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 p-3 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <LogOutIcon className="h-5 w-5" />
                  {!isCollapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              )}
            </Tooltip>
            <Button
              variant="ghost"
              onClick={toggleCollapse}
              className={`w-full justify-center flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 p-3`}
            >
              {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </TooltipProvider>
    </div>
  )
}