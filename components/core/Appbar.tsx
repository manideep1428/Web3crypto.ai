// import { useState } from "react" // Removed unused import
import { usePathname } from "next/navigation" // Removed useRouter as it's not used
import Link from "next/link"
import { MenuIcon, User } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { motion } from "framer-motion" // Import motion
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import UserDetails from "../account/UserDetails"
import WalletButton from "../WalletButton"

// Create motion versions of Button
const MotionButton = motion(Button);

export const Appbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname()
  // const router = useRouter() // Removed unused variable
  const { data: session } = useSession()

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`text-sm pt-1 cursor-pointer transition-colors duration-200 ${
        pathname.startsWith(href) ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
      }`}
    >
      {children}
    </Link>
  )

  return (
    <div className="bg-background text-foreground border-b border-border">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center">
          <MotionButton
            variant="ghost"
            size="icon"
            className="p-2 text-foreground hover:text-primary hover:bg-muted" // Removed 'left-4', adjusted classes
            onClick={toggleSidebar}
            whileTap={{ scale: 0.90 }}
          >
            <MenuIcon className="h-6 w-6" />
          </MotionButton>
          <Link href="/markets" className="text-xl pl-4 cursor-pointer font-semibold text-primary"> {/* Changed to text-primary */}
            <i>WebCrypto.ai</i>
          </Link>
          <div className="hidden md:flex ml-6 gap-6 p-4"> {/* Added ml-6 for spacing from logo, was m-auto */}
            <NavItem href="/markets">Markets</NavItem>
            <NavItem href="/trade/btcusdt">Trade</NavItem>
            {/* Add other main navigation items here if necessary */}
          </div>
        </div>
        <div className="flex md:flex flex-row justify-center gap-4 items-center"> {/* Reduced gap from 5 to 4 */}
          <Input
            type="search"
            placeholder="Search markets"
            className="hidden md:block md:max-w-xs lg:max-w-sm text-sm" /* Adjusted max-width and added text-sm */
          />
          <WalletButton /> {/* Moved WalletButton after search on medium screens */}
          <div className="mr-2">
            {session?.user ? (
              <UserDetails />
            ) : (
              <MotionButton variant="ghost" size="icon" onClick={() => signIn("google")} className="text-muted-foreground hover:text-primary" whileTap={{ scale: 0.90 }}>
                <User className="h-5 w-5" />
              </MotionButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}