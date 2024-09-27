import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, LayoutDashboard, ShoppingCart, User, Users, Share2, Settings, Bell, HelpCircle, LogOut } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function NavSidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const navItems = [
    { name: "Markets", icon: LayoutDashboard, href: "/markets" },
    { name: "Orders", icon: ShoppingCart, href: "/orders" },
    { name: "Account", icon: User, href: "/account" },
    { name: "Notifications", icon: Bell, href: "#" },
    { name: "Referral", icon: Share2, href: "/user/referal" },
    { name: "Social Media", icon: Users, href: "/connect-socials" },
    { name: "Settings", icon: Settings, href: "#" },
    { name: "Help & Support", icon: HelpCircle, href: "#" },
    { name: "Logout", icon: LogOut, href: "/logout" },
  ]

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
    >
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}