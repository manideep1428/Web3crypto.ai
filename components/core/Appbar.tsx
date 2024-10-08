import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { HandCoins, Menu, MenuIcon, User } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import UserDetails from "../account/UserDetails"
import Walletbutton from "../WalletButton"
import DepositButton from "../DepositButton"


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
        <div className="flex items-center">
          <button
            className="left-4 p-2 bg-background border rounded-md"
            onClick={toggleSidebar}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <Link href="/markets" className="text-xl pl-4 cursor-pointer font-semibold dark:text-white">
            <i>WebCrypto.ai</i>
          </Link>
          <div className="hidden md:flex m-auto gap-6 p-4">
            <NavItem href="/markets">Markets</NavItem>
            <NavItem href="/trade/btcusdt">Trade</NavItem>
          </div>
        </div>
        <div className="flex md:flex flex-row justify-center gap-5 items-center">
          <div>
          <DepositButton />
          </div>
          <Walletbutton/>
          <Input
            type="search"
            placeholder="Search markets"
            className="hidden md:max-w-sm"
          />
          <div className="mr-2">
            {session?.user ? (
              <UserDetails />
            ) : (
              <Button className="rounded-full bg-white text-black dark:text-white dark:bg-black" onClick={() => signIn("google")}><User/></Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}