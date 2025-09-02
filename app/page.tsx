"use client";

import { Button } from "@/components/ui/button";
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
  // Moon, // Removed as toggle is handled globally
  // Sun, // Removed as toggle is handled globally
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/core/Footer";
import AnimatedText from "@/components/AnimatedText";

export default function Component() {
  const router = useRouter();
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Updated cryptoPrices state for API data, loading, and error
  const [cryptoPrices, setCryptoPrices] = useState<{ [key: string]: { usd: number | null } } | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);

  const navItems = [
    { name: "Markets", href: "/markets" },
    { name: "Trade", href: "/trade/btcusdt" },
    { name: "Wallet", href: "/wallet" },
    { name: "Learn", href: "/learn" },
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoadingPrices(true);
      setPriceError(null);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd');
        if (!response.ok) {
          throw new Error(`Failed to fetch prices: ${response.statusText} (${response.status})`);
        }
        const data = await response.json();
        setCryptoPrices(data);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
        setPriceError(error instanceof Error ? error.message : "An unknown error occurred while fetching prices.");
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchPrices();
    // Optional: set an interval to re-fetch, e.g., every 60 seconds
    // const intervalId = setInterval(fetchPrices, 60000);
    // return () => clearInterval(intervalId);
  }, []);

  if (session.data?.user) {
    router.push("/");
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // Reduced y from 30 to 20
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut", // Changed from spring to easeOut
        duration: 0.5,    // Added duration
      },
    },
  };

  const fadeInUpVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut", // Changed from spring to easeOut
        duration: 0.5,    // Added duration
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 dark:from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="bg-background/80 dark:bg-background/80 border-b border-primary/20 dark:border-primary/10 backdrop-blur-lg py-4 px-6 sm:px-10 fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Web3Crypto.ai
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="default" onClick={() => router.push("/auth/signin")}>
              Get Started
            </Button>
            
            {/* Dark Mode Toggle Removed - Assuming global toggle elsewhere */}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Dark Mode Toggle Removed - Assuming global toggle elsewhere */}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-card py-4 px-6 mt-16 fixed w-full z-40"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button variant="default" className="w-full mt-4" onClick={() => router.push("/auth/signin")}>
              Get Started
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 dark:opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 dark:from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-8"
            >
              <div
                className="relative inline-block"
              >
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-orange-500 to-red-500">
                  <AnimatedText text="Learn Crypto with Confidence" />
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-orange-600/20 blur-lg -z-10" />
              </div>

              <AnimatedText text="Join the Journey about Crypto on the world's most powerful crypto learning platform." className="text-lg sm:text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed" />

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-primary-foreground text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-primary/50 text-primary hover:bg-primary/10 text-lg py-6 px-8 rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  Explore Markets
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background/50 dark:bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Wallet,
                  title: "Secure Wallet",
                  description: "Store your crypto assets safely",
                },
                {
                  icon: BarChart2,
                  title: "Advanced Trading",
                  description: "Access powerful trading tools",
                },
                {
                  icon: Lock,
                  title: "Bank-grade Security",
                  description: "Your funds are always protected",
                },
                {
                  icon: Zap,
                  title: "Instant Transactions",
                  description: "Lightning-fast crypto transfers",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="bg-card border-primary/10 dark:border-primary/20
                    p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-primary/20 border backdrop-blur-sm transition-all duration-300"
                >
                  <feature.icon className="h-12 w-12 text-primary mb-6" />
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cryptocurrencies Section */}
        <section className="py-20 bg-background relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent"
            >
              Popular Cryptocurrencies
            </motion.h2>
            {isLoadingPrices && (
              <motion.p
                className="text-center text-lg text-foreground/80"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Loading prices...
              </motion.p>
            )}
            {priceError && <p className="text-center text-lg text-red-500">Error: {priceError}</p>}
            {!isLoadingPrices && !priceError && cryptoPrices && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: "bitcoin", icon: Bitcoin, name: "Bitcoin", symbol: "BTC", color: "primary" },
                { id: "ethereum", icon: Bitcoin, name: "Ethereum", symbol: "ETH", color: "sky" }, // Assuming Bitcoin icon is a placeholder for Ethereum
                { id: "ripple", icon: Globe, name: "Ripple", symbol: "XRP", color: "indigo" },
              ].map((cryptoItem) => { // Removed unused 'index'
                const priceData = cryptoPrices[cryptoItem.id as keyof typeof cryptoPrices];
                const currentPrice = priceData?.usd;

                return (
                <motion.div
                  key={cryptoItem.id}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="bg-card border-primary/10 dark:border-primary/20
                    p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-primary/20 border backdrop-blur-sm transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <cryptoItem.icon className={`h-12 w-12 text-${cryptoItem.color}-500 relative z-10`} /> {/* Adjusted to keep dynamic color for now, though ideally theme based */}
                      <div className="absolute inset-0 bg-primary/20 blur-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        {cryptoItem.name}
                      </h3>
                      <p className="text-muted-foreground">{cryptoItem.symbol}</p>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    {currentPrice !== null && typeof currentPrice !== 'undefined' ? (
                      <p className="text-2xl font-bold text-foreground">
                        ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    ) : (
                      <p className="text-2xl font-bold text-foreground/50">Price N/A</p>
                    )}
                    {/* Percentage change removed as it's not directly available from this simple API endpoint */}
                  </div>
                </motion.div>
                );
              })}
            </div>
            )} {/* Closing tag for the conditional rendering block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                variant="outline"
                className="border-2 border-primary/50 text-primary hover:bg-primary/10 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                View All Markets
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-8"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 bg-clip-text text-transparent"
                >
                  Start Your Crypto Journey Today
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-lg sm:text-xl text-foreground/80"
                >
                  Join millions of users worldwide and experience the power of
                  decentralized finance.
                </motion.p>
                <motion.ul variants={containerVariants} className="space-y-6">
                  {[
                    "Create your account in minutes",
                    "Secure storage for your digital assets",
                    "24/7 access to global markets",
                    "Advanced trading tools and analytics",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-lg transform group-hover:scale-110 transition-transform duration-300" />
                        <svg
                          className="h-6 w-6 text-primary relative z-10"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-foreground/80 group-hover:text-primary transition-colors duration-300">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-primary-foreground text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    Create Your Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                variants={fadeInUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-600/30 rounded-2xl transform -rotate-6 blur-xl" /> {/* The orange-600 is part of the new color scheme */}
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
                  <div className="relative w-full h-80 lg:h-96">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="Crypto trading platform"
                      className="object-cover"
                      fill={true}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}