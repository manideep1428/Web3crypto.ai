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
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/core/Footer";

export default function Component() {
  const router = useRouter();
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState({
    BTC: 65000,
    ETH: 12000,
    XRP: 1.20,
  });

  const navItems = [
    { name: "Markets", href: "/markets" },
    { name: "Trade", href: "/trade/btcusdt" },
    { name: "Wallet", href: "/wallet" },
    { name: "Learn", href: "/learn" },
  ];

  useEffect(() => {
    // Check if user prefers dark mode
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }

    const interval = setInterval(() => {
      setCryptoPrices({
        BTC: Math.random() * 10000 + 30000,
        ETH: Math.random() * 1000 + 2000,
        XRP: Math.random() * 1 + 0.5,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  if (session.data?.user) {
    router.push("/");
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const fadeInUpVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 
      'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200' : 
      'bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800'}`}>
      
      {/* Background effects */}
      <div className={`fixed inset-0 ${isDarkMode ? 
        'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10' : 
        'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5'} via-transparent to-transparent pointer-events-none`} />
      
      {/* Header */}
      <header className={`${isDarkMode ? 
        'bg-gray-900/80 border-yellow-500/10' : 
        'bg-white/80 border-yellow-500/20'} backdrop-blur-lg py-4 px-6 sm:px-10 fixed w-full z-50 border-b`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Web3Crypto.ai
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${isDarkMode ? 'text-gray-300 hover:text-yellow-500' : 'text-gray-700 hover:text-yellow-600'} transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => router.push("/auth/signin")}
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            >
              Get Started
            </Button>
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={`${isDarkMode ? 'text-gray-300 hover:text-yellow-500' : 'text-gray-700 hover:text-yellow-600'}`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            className={`md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} py-4 px-6 mt-16 fixed w-full z-40`}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 ${isDarkMode ? 
                  'text-gray-300 hover:text-yellow-500' : 
                  'text-gray-700 hover:text-yellow-600'} transition-colors`}
              >
                {item.name}
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
      
      {/* Main Content */}
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 relative overflow-hidden">
          <div className={`absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center ${isDarkMode ? 'opacity-5' : 'opacity-10'}`} />
          <div className={`absolute inset-0 ${isDarkMode ? 
            'bg-gradient-to-b from-yellow-500/10' : 
            'bg-gradient-to-b from-yellow-500/5'} via-transparent to-transparent`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent animate-pulse" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-8"
            >
              <motion.div
                variants={itemVariants}
                className="relative inline-block"
              >
                <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600">
                  Learn Crypto with
                  <span className="block mt-2">Confidence</span>
                </motion.h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 blur-lg -z-10" />
              </motion.div>

              <motion.p
                variants={itemVariants}
                className={`text-lg sm:text-xl md:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto leading-relaxed`}
              >
                Join the Journey about Crypto on the world's most
                powerful crypto learning platform.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto border-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 text-lg py-6 px-8 rounded-xl backdrop-blur-sm transition-all duration-300`}
                >
                  Explore Markets
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-16 ${isDarkMode ? 
          'bg-gradient-to-b from-gray-800/50 to-gray-900/50' : 
          'bg-gradient-to-b from-gray-100/50 to-gray-200/50'} backdrop-blur-sm`}>
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
                  className={`${isDarkMode ? 
                    'bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-500/10' : 
                    'bg-gradient-to-br from-gray-50 to-gray-100 border-yellow-500/20'} 
                    p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-yellow-500/20 border backdrop-blur-sm transition-all duration-300`}
                >
                  <feature.icon className="h-12 w-12 text-yellow-500 mb-6" />
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cryptocurrencies Section */}
        <section className={`py-20 ${isDarkMode ? 
          'bg-gradient-to-b from-gray-900 to-gray-800' : 
          'bg-gradient-to-b from-gray-200 to-gray-100'} relative`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
            >
              Popular Cryptocurrencies
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Bitcoin,
                  name: "Bitcoin",
                  symbol: "BTC",
                  color: "yellow",
                },
                {
                  icon: Bitcoin,
                  name: "Ethereum",
                  symbol: "ETH",
                  color: "blue",
                },
                { 
                  icon: Globe, 
                  name: "Ripple", 
                  symbol: "XRP", 
                  color: "indigo" 
                },
              ].map((crypto, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className={`${isDarkMode ? 
                    'bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-500/10' : 
                    'bg-gradient-to-br from-gray-50 to-gray-100 border-yellow-500/20'} 
                    p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-yellow-500/20 border backdrop-blur-sm transition-all duration-300`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <crypto.icon className={`h-12 w-12 text-${crypto.color}-500 relative z-10`} />
                      <div className="absolute inset-0 bg-yellow-500/20 blur-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        {crypto.name}
                      </h3>
                      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      ${cryptoPrices[crypto.symbol]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-sm ${index % 2 === 0 ? "text-green-500" : "text-red-500"}`}>
                      {index % 2 === 0 ? "+" : "-"}
                      {(Math.random() * 5).toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                variant="outline"
                className="border-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                View All Markets
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 ${isDarkMode ? 
          'bg-gradient-to-b from-gray-800 to-gray-900' : 
          'bg-gradient-to-b from-gray-100 to-gray-200'} relative`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent" />
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
                  className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent"
                >
                  Start Your Crypto Journey Today
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
                        <div className="absolute inset-0 bg-yellow-500/20 blur-lg transform group-hover:scale-110 transition-transform duration-300" />
                        <svg
                          className="h-6 w-6 text-yellow-500 relative z-10"
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
                      <span className={`${isDarkMode ? 
                        'text-gray-300 group-hover:text-yellow-500' : 
                        'text-gray-700 group-hover:text-yellow-600'} transition-colors duration-300`}>
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 rounded-2xl transform -rotate-6 blur-xl" />
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/20">
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