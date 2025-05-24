import { MarketData } from "@/lib/types";
import React, { useEffect, useState } from "react";

export default function UseMarketWebsockets(market:string) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [priceChangeClassName, setPriceChangeClassName] = useState<
    "text-success" | "text-destructive"
  >("text-success");

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${market}@ticker`
    );

    ws.onmessage = (event) => {
      const data: MarketData = JSON.parse(event.data);
      setMarketData(data);
      setPriceChangeClassName(
        parseFloat(data.P) >= 0 ? "text-success" : "text-destructive"
      );
    };

    return () => ws.close();
  }, [market]);

  return { marketData , priceChangeClassName  }
}
