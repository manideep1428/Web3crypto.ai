"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"
import { getCrypto } from "@/app/utils/ServerProps"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface CryptoData {
  symbol: string
  current_price: string
  priceChangePercent: string
  volume: string
  marketCap: string
  image: string
  name: string
  market_cap_rank: number
}

export default function CryptoList() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [sortColumn, setSortColumn] = useState<keyof CryptoData>("market_cap_rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      const data = await getCrypto()
      const formattedData: CryptoData[] = data.map((item: any) => ({
        image: item.image,
        market_cap_rank: item.market_cap_rank,
        symbol: item.symbol,
        current_price: item.current_price,
        name: item.name,
        priceChangePercent: parseFloat(item.price_change_percentage_24h).toFixed(2),
        volume: formatVolume(parseFloat(item.total_volume)),
        marketCap: formatMarketCap(parseFloat(item.market_cap)),
      }))
      setCryptoData(formattedData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [])

  const formatVolume = (volume: number): string => {
    if (volume >= 1e12) return `${(volume / 1e12).toFixed(2)}T`
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
    return volume.toFixed(2)
  }

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(2)}`
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [fetchData])

  const sortData = (column: keyof CryptoData) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection(column === "market_cap_rank" ? "asc" : "desc")
    }
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    if (tab === "24h") {
      setSortColumn("priceChangePercent")
      setSortDirection("desc")
    } else if (tab === "volume") {
      setSortColumn("volume")
      setSortDirection("desc")
    } else if (tab === "marketCap") {
      setSortColumn("marketCap")
      setSortDirection("desc")
    } else if (tab === "rank") {
      setSortColumn("market_cap_rank")
      setSortDirection("asc")
    }
  }

  const sortedData = [...cryptoData].sort((a, b) => {
    if (sortColumn === "market_cap_rank") {
      return sortDirection === "asc" ? a.market_cap_rank - b.market_cap_rank : b.market_cap_rank - a.market_cap_rank
    } else {
      const aValue = parseFloat(String(a[sortColumn]).replace(/[^\d.-]/g, ""))
      const bValue = parseFloat(String(b[sortColumn]).replace(/[^\d.-]/g, ""))
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
  })

  const renderTable = (data: CryptoData[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableBody>
          {data.slice(0, 12).map((crypto) => (
            <TableRow
              key={crypto.symbol}
              className="hover:cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-900"
              onClick={() => router.push(`/trade/${crypto.symbol}usdt`)}
            >
              <TableCell className="font-medium flex items-center space-x-2">
                <Image src={crypto.image} alt={crypto.name} width={24} height={24} />
                <span className="hidden sm:inline">{crypto.name}</span>
                <span className="sm:hidden">{crypto.symbol.toUpperCase()}</span>
              </TableCell>
              <TableCell className="text-right">${crypto.current_price}</TableCell>
              <TableCell
                className={`text-right ${
                  crypto.priceChangePercent[0] === "-" ? "text-red-500" : "text-green-500"
                }`}
              >
                {crypto.priceChangePercent}%
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell">{crypto.volume}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{crypto.marketCap}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full">
      <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full md:w-3/4 lg:w-1/2 rounded-lg mb-6">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="rank">Rank</TabsTrigger>
        <TabsTrigger value="24h">24h Change</TabsTrigger>
        <TabsTrigger value="volume">Volume</TabsTrigger>
        <TabsTrigger value="marketCap">Market Cap</TabsTrigger>
      </TabsList>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {activeTab === "all" ? "All Cryptocurrencies" : `Sorted by ${activeTab === "rank" ? "Market Cap Rank" : activeTab}`}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sortData(sortColumn)}
            className="flex items-center text-sm"
          >
            {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            {sortColumn === "priceChangePercent" ? "24h" : sortColumn === "market_cap_rank" ? "Rank" : sortColumn}
          </Button>
        </div>
        {renderTable(sortedData)}
      </div>
    </Tabs>
  )
}