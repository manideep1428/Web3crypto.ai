'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  ShoppingCartIcon,
  BellIcon,
  LogOutIcon,
  UserIcon,
  UsersIcon,
  MoonIcon,
  SunIcon,
  TrendingUp,
  ChevronsLeft,
  ChevronsRight,
  Settings,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
  ]

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-background transition-all duration-300 ${
        isOpen ? (isCollapsed ? 'w-20' : 'w-64') : 'w-0'
      } overflow-hidden z-40 border-r flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h1 className="font-bold text-lg">Web3Crypto.ai</h1>}
        <Button variant="ghost" size="icon" onClick={toggleCollapse}>
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </Button>
      </div>
      <TooltipProvider>
        <nav className="flex-grow p-2 space-y-1">
          {menuItems.map((item, index) => (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                    pathName === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
        </nav>
      </TooltipProvider>

      <div className="mt-auto border-t p-2">
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                      isCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && <span className="font-semibold">User Name</span>}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>User Menu</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/referrals">
              <DropdownMenuItem className="cursor-pointer">
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>Referrals</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <SunIcon className="mr-2 h-4 w-4" /> : <MoonIcon className="mr-2 h-4 w-4" />}
              <span>Toggle Theme</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('Logout triggered')}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}