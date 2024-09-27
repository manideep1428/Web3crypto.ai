"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SuccessButton } from "./core/Button";
import { HandCoins, Menu, Wallet, X } from "lucide-react";
import UserDetails from "./UserDetails";
import DarkModeToggle from "./DarkModeToggle";
import { signIn, useSession } from "next-auth/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Walletbutton from "./WalletButton";
import { Skeleton } from "./ui/skeleton";

export const Appbar = () => {
  const route = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data , status } = useSession();

  const handleDeposit = () => {
    if (data?.user) {
      router.push("/deposit");
    } else {
      console.log("Please Signin");
    }
  };

  const NavItem = ({ href, children }: any) => (
    <div
      className={`text-sm pt-1 cursor-pointer ${
        route.startsWith(href) ? "text-white" : "text-slate-500"
      }`}
      onClick={() => {
        router.push(href);
        setMenuOpen(false);
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="text-black bg-white dark:text-white dark:bg-black border-b border-slate-800">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center">
          <div
            className="text-xl pl-4 cursor-pointer font-semibold dark:text-white"
            onClick={() => router.push("/markets")}
          >
            <i> WebCrypto.ai </i>
          </div>
          <div className="hidden md:flex m-auto gap-6 p-4">
            <NavItem href="/markets">Markets</NavItem>
            <NavItem href="/trade/SOL_USDC">Trade</NavItem>
          </div>
        </div>
        <div className="md:hidden flex items-center mr-3 gap-4">
          {status === "loading" ?  <Skeleton className="rounded-full w-12 h-12"/> : data?.user ? (
            <div className="mr-2">
              <UserDetails />
            </div>
          ) : (
            <Button onClick={() => signIn("google")} className="mr-2">
              Login
            </Button>
          ) }
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="hidden md:flex flex-row justify-center gap-5">
          <Button
            className="bg-transparent text-orange-500 p-2 hover:bg-orange-500 hover:text-white"
            onClick={handleDeposit}
          >
            <HandCoins />
            Deposit
          </Button>
          <Input
            type="search"
            placeholder="Search markets"
            className="max-w-sm"
          />
          {data?.user && (
            <Walletbutton/>
          )}
          {data?.user ? (
            <div className="flex m-auto gap-2">
              <UserDetails />
            </div>
          ) : (
            <Button onClick={async () => await signIn("google")}>Login</Button>
          )}
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col p-4 gap-3 text-black bg-white dark:text-white dark:bg-black">
          <NavItem href="/markets">Markets</NavItem>
          <NavItem href="/trade/SOL_USDC">Trade</NavItem>
          <DarkModeToggle />
          <div
            className="flex bg-transparent text-orange-500 p-2 hover:bg-orange-500 hover:text-white"
            onClick={handleDeposit}
          >
            <HandCoins />
            Deposit
          </div>
          {data?.user && (
            <Walletbutton/>
          )}
        </div>
      )}
    </div>
  );
};
