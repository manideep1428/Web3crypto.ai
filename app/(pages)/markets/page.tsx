// app/(pages)/markets/page.tsx
"use client"; // Required for framer-motion and hooks

import CryptoList from "@/components/trade/markets/cryptoPage";
import { motion } from "framer-motion";

// Define a simple fadeInUp variant for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function MarketsPage() { // Renamed CryptoDashboard to MarketsPage
  return (
    <div className="space-y-12"> {/* Main container for sections */}
      {/* Section 1: Hero/Overview */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible" // Animate on initial load, as it's likely at the top
        viewport={{ once: true, amount: 0.2 }}
        className="p-6 md:p-8 rounded-lg bg-card border border-border shadow-lg"
      >
        <h2 className="text-3xl font-bold text-primary mb-4">Market Overview</h2>
        <p className="text-muted-foreground">
          Get a quick snapshot of the current cryptocurrency market trends and key statistics.
        </p>
        {/* TODO: Add components for market stats, charts, etc. */}
        <div className="mt-4">
          <p className="text-sm text-foreground/70 italic">Market overview components coming soon.</p>
        </div>
      </motion.section>

      {/* Section 2: Main Crypto List (existing component) */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible" // Trigger animation when this section scrolls into view
        viewport={{ once: true, amount: 0.05 }} // Trigger a bit earlier as the list can be tall
      >
        <CryptoList />
      </motion.section>

      {/* Section 3: Featured/Trending Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="p-6 md:p-8 rounded-lg bg-card border border-border shadow-lg"
      >
        <h2 className="text-3xl font-bold text-primary mb-4">Trending Coins</h2>
        <p className="text-muted-foreground">
          Discover cryptocurrencies that are currently making waves in the market.
        </p>
        {/* TODO: Add components for displaying 3-4 trending coins in cards */}
        <div className="mt-4">
          <p className="text-sm text-foreground/70 italic">Trending coins display coming soon.</p>
        </div>
      </motion.section>

      {/* Optional Section 4: Educational/News Snippet */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="p-6 md:p-8 rounded-lg bg-card border border-border shadow-lg"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Market Insights</h2>
        <p className="text-muted-foreground">
          Stay informed with the latest news and educational content about the crypto market.
        </p>
        {/* TODO: Add components for news links or brief articles */}
        <div className="mt-4">
          <p className="text-sm text-foreground/70 italic">Market insights components coming soon.</p>
        </div>
      </motion.section>
    </div>
  );
}