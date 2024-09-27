"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setPrice,
  setQuantity,
  setActiveTab,
  setOrderType,
  setMarketPrice,
} from "@/store/slices/cryptoOrders";
import { useToast } from "@/components/ui/use-toast";

export function OrderUI({ market }: { market: string }) {
  const dispatch = useDispatch();
  const { price, quantity, activeTab, orderType, marketPrice } = useSelector(
    (state: RootState) => state.order
  );
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const router = useRouter();
  const { toast }  = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedImage = localStorage.getItem("imageUrl");
      if (storedImage) setImage(storedImage);
    }

    // Initialize WebSocket connection
    ws.current = new WebSocket(
      `wss://stream.binance.com:9443/ws/${market.toLowerCase()}@ticker`
    );

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(setMarketPrice(parseFloat(data.c)));
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [market, dispatch]);

  const handleOrder = async () => {
    try {
      setLoading(true);
      if (activeTab === "buy") {
        const response = await axios.post("/api/buy-crypto", {
          market,
          quantity,
          price,
        });
        if (!response.data.sucess) return new Error(response.data.message);
        toast({
          title: "Order placed",
          description: `You have successfully placed a buy order for ${quantity} ${market} at ${price} USD.`,
          action: (
            <ToastAction
              altText="See the order details"
              onClick={() => router.push("/orders")}
            >
              Details
            </ToastAction>
          ),
        });
      } else if (activeTab === "sell") {
        const res = await axios.post("/api/sell-crypto", {
          market,
          quantity,
          price,
        });
        if (!res.data.success) return new Error(res.data.message);
        toast({
          title: "Order Placed",
          description: `You have successfully sold an order for ${quantity} ${market} at ${price} USD.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Please Try again",
        variant: "destructive",
        action: <ToastAction altText="try again"> Try again </ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    dispatch(setPrice(newPrice));
    if (newPrice && quantity) {
      const newQuantity = (
        (parseFloat(quantity) * marketPrice) /
        parseFloat(newPrice)
      ).toFixed(8);
      dispatch(setQuantity(newQuantity));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    dispatch(setQuantity(newQuantity));
    if (newQuantity && price) {
      const newPrice = (
        (parseFloat(price) * parseFloat(newQuantity)) /
        parseFloat(quantity)
      ).toFixed(8);
      dispatch(setPrice(newPrice));
    }
  };

  const calculateFee = () => {
    const total = parseFloat(price) * parseFloat(quantity);
    return isNaN(total) ? "0.00000000" : (total * 0.002).toFixed(8); // 0.2% fee
  };

  const calculateTotal = () => {
    const total = parseFloat(price) * parseFloat(quantity);
    return isNaN(total) ? "0.00" : total.toFixed(2);
  };

  return (
    <Card className="w-full max-w-md mx-auto font-bold p-4 border-none rounded-none">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          dispatch(setActiveTab(value as "buy" | "sell"))
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="buy"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Sell
          </TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Available Balance</span>
              <span> USDC</span>
            </div>
            <div>
              <Label htmlFor="orderType">Order Type</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  variant={orderType === "limit" ? "default" : "outline"}
                  onClick={() => dispatch(setOrderType("limit"))}
                >
                  Limit
                </Button>
                <Button
                  variant={orderType === "market" ? "default" : "outline"}
                  onClick={() => dispatch(setOrderType("market"))}
                >
                  Market
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <div className="relative mt-1">
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={handlePriceChange}
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Image src="/usdc.webp" alt="USDC" width={24} height={24} />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="relative mt-1">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {image && (
                    <Image src={image} alt="Crypto" width={24} height={24} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>≈ {calculateTotal()} USDC</span>
              <span>Fee: {calculateFee()} USDC</span>
            </div>
            <div className="flex justify-between gap-2">
              {["25%", "50%", "75%", "Max"].map((percent) => (
                <Button key={percent} variant="outline" size="sm">
                  {percent}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleOrder}
              className={
                activeTab === "buy"
                  ? "w-full bg-green-500 hover:bg-green-600"
                  : "w-full bg-red-500 hover:bg-red-600"
              }
            >
              {activeTab === "buy"
                ? loading
                  ? "Buying..."
                  : "Buy"
                : loading
                ? "Selling..."
                : "Sell"}
            </Button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch id="post-only" />
                <Label htmlFor="post-only">Post Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="ioc" />
                <Label htmlFor="ioc">IOC</Label>
              </div>
            </div>
            <div className="text-sm text-center">
              Market Price: {marketPrice.toFixed(8)} USDC
            </div>
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
}
