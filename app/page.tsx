'use client'

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Bitcoin,
  Wallet,
  BarChart2,
  Lock,
  Zap,
  Globe,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Footer from "@/components/core/Footer"

export default function Component() {
  const router = useRouter()
  const session = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cryptoPrices, setCryptoPrices] = useState({
    BTC: 65000,
    ETH: 12000,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices({
        BTC: Math.random() * 10000 + 30000,
        ETH: Math.random() * 1000 + 2000,
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (session.data?.user) {
    router.push("/")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 px-6 sm:px-10 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Web3Crypto.ai
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            {["Markets", "Trade", "Wallet", "Learn"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-gray-300 hover:text-yellow-500 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Button
              onClick={() => router.push("/auth/signin")}
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            >
              Get Started
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-800 py-4 px-6 mt-16 fixed w-full z-40"
          >
            {["Markets", "Trade", "Wallet", "Learn"].map((item) => (
              <Link
                key={item}
                href="#"
                className="block py-2 text-gray-300 hover:text-yellow-500 transition-colors"
              >
                {item}
              </Link>
            ))}
            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full mt-4 bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            >
              Get Started
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
      <main className="flex-grow pt-20">
        <section className="py-20 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-8"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-6xl font-bold leading-tight"
              >
                Learn Crypto with
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                  {" "}
                  Confidence
                </span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto">
                Join the of Journey about Crypto on the {"world's "}most powerful crypto learning platform.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full sm:w-auto bg-yellow-500 text-gray-900 hover:bg-yellow-600 text-lg py-6 px-8"
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="w-full sm:w-auto text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900 text-lg py-6 px-8">
                  Explore Markets
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Wallet, title: "Secure Wallet", description: "Store your crypto assets safely" },
                { icon: BarChart2, title: "Advanced Trading", description: "Access powerful trading tools" },
                { icon: Lock, title: "Bank-grade Security", description: "Your funds are always protected" },
                { icon: Zap, title: "Instant Transactions", description: "Lightning-fast crypto transfers" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-yellow-500/20 transition-shadow duration-300"
                >
                  <feature.icon className="h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-center mb-12"
            >
              Popular Cryptocurrencies
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Bitcoin, name: "Bitcoin", symbol: "BTC", color: "yellow" },
                { icon: Bitcoin , name: "Ethereum", symbol: "ETH", color: "blue" },
                { icon: Globe, name: "Ripple", symbol: "XRP", color: "indigo" },
              ].map((crypto, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-yellow-500/20 transition-shadow duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <crypto.icon className={`h-12 w-12 text-${crypto.color}-500`} />
                    <div>
                      <h3 className="text-xl font-semibold">{crypto.name}</h3>
                      <p className="text-gray-400">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      $ 0.00 
                    </p>
                    <p className={`text-sm ${index % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                      {index % 2 === 0 ? "+" : "-"}
                      {(Math.random() * 5).toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900">
                View All Markets
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold">
                  Start Your Crypto Journey Today
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xl text-gray-400">
                  Join millions of users worldwide and experience the power of decentralized finance.
                </motion.p>
                <motion.ul variants={containerVariants} className="space-y-4">
                  {[
                    "Create your account in minutes",
                    "Secure storage for your digital assets",
                    "24/7 access to global markets",
                    "Advanced trading tools and analytics",
                  ].map((item, index) => (
                    <motion.li key={index} variants={itemVariants} className="flex items-center space-x-3">
                      <svg
                        className="h-5 w-5 text-yellow-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 text-lg py-6 px-8"
                  >
                    Create Your Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg transform -rotate-6"></div>
                <Image
                  fill={true}
                  src="/placeholder.svg?height=600&width=800"
                  alt="Crypto trading platform"
                  className="relative z-10 rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}