// app/(pages)/trade/[market]/page.tsx
"use client";

import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// import { Card } from "@/components/ui/card"; // Card component is not directly used in this layout
import { Ask } from "@/components/trade/markets/AskTable";
import { Bid } from "@/components/trade/markets/BidTable";
import { Skeleton } from "@/components/ui/skeleton";
import { TradeViewChartSkeleton } from "@/components/Skeletons/TradingViewSkeleton";
import { AskSkeleton } from "@/components/Skeletons/AskBidSkeleton"; // Assuming one skeleton for both Ask/Bid lists is fine
import TradeViewChart from "@/components/trade/markets/TradeView";
import { OrderUI } from "@/components/trade/markets/OrderUI";
import { MarketBar } from "@/components/trade/markets/MarketBar";

type Order = [string, string];
type OrderBookUpdate = {
  e: string; E: number; s: string; U: number; u: number;
  b: Order[]; a: Order[];
};
type OrderBookState = {
  bids: Map<string, string>;
  asks: Map<string, string>;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TradePage() {
  const params = useParams();
  const market = params.market as string; // Get market from params

  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: new Map(),
    asks: new Map(),
  });
  const [isLoading, setIsLoading] = useState(true); // For initial load and WebSocket data readiness

  const { lastJsonMessage } = useWebSocket(
    market ? `wss://stream.binance.com:9443/ws/${market.toLowerCase()}@depth` : null,
    {
      onOpen: () => console.log(`Connected to ${market} WebSocket`),
      shouldReconnect: (/*closeEvent*/) => true, // Removed unused closeEvent
    }
  );

  useEffect(() => {
    if (market && !lastJsonMessage) {
        // Reset loading state if market changes and we are waiting for first message
        setIsLoading(true);
    }
    if (lastJsonMessage) {
      const update = lastJsonMessage as OrderBookUpdate;
      // Assuming first message means data is ready
      if (isLoading) setIsLoading(false);

      setOrderBook((prevOrderBook) => {
        const newBids = new Map(prevOrderBook.bids);
        const newAsks = new Map(prevOrderBook.asks);

        update.b.forEach(([price, quantity]) => {
          if (parseFloat(quantity) === 0) newBids.delete(price);
          else newBids.set(price, quantity);
        });
        update.a.forEach(([price, quantity]) => {
          if (parseFloat(quantity) === 0) newAsks.delete(price);
          else newAsks.set(price, quantity);
        });
        return { bids: newBids, asks: newAsks };
      });
    }
  }, [lastJsonMessage, market, isLoading]); // Added isLoading to dependencies

  // Effect to set loading true when market changes, until first message arrives
  useEffect(() => {
    setIsLoading(true);
  }, [market]);

  if (!market) {
    return <div className="p-4 text-destructive">Market parameter is missing.</div>; // Handle missing market case
  }

  return (
    <div className="space-y-6 lg:space-y-8"> {/* Main container for sections */}
      {/* Section 1: Market Bar - Full Width */}
      <motion.section
        variants={sectionVariants}
        initial="visible"
        animate="visible" // Always visible, no entry animation needed for this static bar
        className="bg-card p-3 md:p-4 rounded-lg shadow-lg border border-border"
      >
        <MarketBar market={market} />
      </motion.section>

      {/* Section 2: Main Trading Area (Chart, Order Book, Order Form) - Complex Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Column (Chart and potentially other info) */}
        <div className="flex-grow lg:w-3/5 space-y-6 lg:space-y-8">
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate={!isLoading ? "visible" : "hidden"}
            className="h-[450px] bg-card p-1 rounded-lg shadow-lg border border-border"
          >
            {isLoading ? <TradeViewChartSkeleton /> : <TradeViewChart market={market} />}
          </motion.section>

          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible" // Can be visible by default, or tied to another loading state
            className="bg-card p-4 md:p-6 rounded-lg shadow-lg border border-border"
          >
            <h3 className="text-xl font-semibold text-primary mb-3">Your Activity</h3>
            <p className="text-muted-foreground text-sm">
              Open orders and trade history for {market.toUpperCase().replace('USDT', '/USDT')} will appear here.
            </p>
            <div className="mt-3">
              <p className="text-xs text-foreground/70 italic">Activity display components coming soon.</p>
            </div>
          </motion.section>
        </div>

        {/* Right Column (Order Book and Order UI) */}
        <div className="lg:w-2/5 space-y-6 lg:space-y-8">
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate={!isLoading ? "visible" : "hidden"}
            className="bg-card p-4 md:p-6 rounded-lg shadow-lg border border-border"
          >
            <h3 className="text-xl font-semibold text-primary mb-3">Order Book</h3>
            <div className="space-y-2 h-[250px] md:h-[300px] overflow-y-auto"> {/* Adjusted height */}
              {isLoading ? <AskSkeleton /> : <Ask asks={orderBook.asks} />}
              {isLoading ? <AskSkeleton /> : <Bid bids={orderBook.bids} />}
            </div>
          </motion.section>

          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate={!isLoading ? "visible" : "hidden"}
            className="bg-card p-4 md:p-6 rounded-lg shadow-lg border border-border"
          >
            <h3 className="text-xl font-semibold text-primary mb-3">Place Order</h3>
            {/* Ensure OrderUI or its skeleton fits well */}
            {isLoading ? <Skeleton className="h-[280px] md:h-[320px] w-full" /> : <OrderUI market={market} />}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
