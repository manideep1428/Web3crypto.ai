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

interface SideNavbarProps {
  isOpen: boolean
}

export default function SideNavbar({ isOpen }: SideNavbarProps) {
  const { theme, setTheme } = useTheme()
  const pathName = usePathname();

  const menuItems = [
    { icon: TrendingUp, label: 'Markets', href: '/markets' },
    { icon: ShoppingCartIcon, label: 'Orders', href: '/orders' },
    { icon: ShoppingCartIcon, label: 'My Trading', href: '/trading' },
    { icon: BellIcon, label: 'Notifications', href: '/notifications' },
    { icon: UserIcon, label: 'Profile', href: '/profile' },
    { icon: UsersIcon, label: 'Referrals', href: '/referrals' },
  ]

  return (
    <div className={`fixed top-16 left-0 h-full bg-background border-r transition-all duration-300 ${isOpen ? 'w-[240px]' : 'w-0'} overflow-hidden z-40`}>
      <nav className="h-full py-20 px-4 flex flex-col justify-center gap-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`${pathName === item.href ? 'bg-muted-foreground/30  rounded-sm' : ''}  flex p-6 space-x-2 text-muted-foreground hover:text-primary py-2 `}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="mt-auto space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Social Connect</h4>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-muted hover:bg-muted-foreground/20">
                <FacebookIcon className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-full bg-muted hover:bg-muted-foreground/20">
                <TwitterIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button 
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button 
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
            onClick={() => console.log('Logout')}
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}