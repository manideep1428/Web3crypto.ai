import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { HandCoins, Menu, MenuIcon } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import UserDetails from "../account/UserDetails"
import Walletbutton from "../WalletButton"
import DarkModeToggle from "../DarkModeToggle"


export const Appbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()

  const handleDeposit = () => {
    if (session?.user) {
      router.push("/deposit")
    } else {
      console.log("Please Sign in")
    }
  }

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`text-sm pt-1 cursor-pointer ${pathname.startsWith(href) ? "text-white" : "text-slate-500"
        }`}
    >
      {children}
    </Link>
  )

  return (
    <div className="text-black bg-white dark:text-white dark:bg-black border-b border-slate-800">
      <div className="flex justify-between items-center p-2">
        <button
          className="fixed top-20 left-4 z-40 p-2 bg-background border rounded-md"
          onClick={toggleSidebar}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <Link href="/markets" className="text-xl pl-4 cursor-pointer font-semibold dark:text-white">
            <i>WebCrypto.ai</i>
          </Link>
          <div className="hidden md:flex m-auto gap-6 p-4">
            <NavItem href="/markets">Markets</NavItem>
            <NavItem href="/trade/SOL_USDC">Trade</NavItem>
          </div>
        </div>
        <div className="hidden md:flex flex-row justify-center gap-5 items-center">
          <Button
            variant="outline"
            className="text-orange-500 hover:bg-orange-500 hover:text-white"
            onClick={handleDeposit}
          >
            <HandCoins className="mr-2 h-4 w-4" />
            Deposit
          </Button>
          <Input
            type="search"
            placeholder="Search markets"
            className="max-w-sm"
          />
          <div className="mr-2">
            {session?.user ? (
              <UserDetails />
            ) : (
              <Button onClick={() => signIn("google")}>Login</Button>
            )}
          </div>
          <DarkModeToggle />
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu />
          </Button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col p-4 gap-3">
          <NavItem href="/markets">Markets</NavItem>
          <NavItem href="/trade/btcusdt">Trade</NavItem>
          <Button
            variant="outline"
            className="text-orange-500 hover:bg-orange-500 hover:text-white"
            onClick={handleDeposit}
          >
            <HandCoins className="mr-2 h-4 w-4" />
            Deposit
          </Button>
          {session?.user && <Walletbutton />}
          <DarkModeToggle />
        </div>
      )}
    </div>
  )
}