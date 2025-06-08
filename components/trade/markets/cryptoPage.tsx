"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp, Search, X } from "lucide-react"
import { getCrypto } from "@/app/utils/ServerProps"
import Image from "next/image"
import { useRouter } from "next/navigation"
import CryptoListSkeleton from "@/components/Skeletons/MarketsSkeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export default function Component() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [sortColumn, setSortColumn] = useState<keyof CryptoData>("market_cap_rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      const data = await getCrypto()
      setLoading(false)
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

  const sortedAndFilteredData = [...cryptoData]
    .filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortColumn === "market_cap_rank") {
        return sortDirection === "asc" ? a.market_cap_rank - b.market_cap_rank : b.market_cap_rank - a.market_cap_rank
      } else {
        const aValue = parseFloat(String(a[sortColumn]).replace(/[^\d.-]/g, ""))
        const bValue = parseFloat(String(b[sortColumn]).replace(/[^\d.-]/g, ""))
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
    })

  const renderTable = (data: CryptoData[]) => (
    <ScrollArea className="h-[600px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 bg-background z-10">Name</TableHead>
            <TableHead className="sticky top-0 bg-background z-10 text-right">Price</TableHead>
            <TableHead className="sticky top-0 bg-background z-10 text-right">24h Change</TableHead>
            <TableHead className="sticky top-0 bg-background z-10 text-right hidden sm:table-cell">Volume</TableHead>
            <TableHead className="sticky top-0 bg-background z-10 text-right hidden md:table-cell">Market Cap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((crypto) => (
            <TableRow
              key={crypto.symbol}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => router.push(`/trade/${crypto.symbol}usdt`)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Image src={crypto.image} alt={crypto.name} width={32} height={32} className="rounded-full" />
                  <span className="hidden sm:inline">{crypto.name}</span>
                  <span className="sm:hidden">{crypto.symbol.toUpperCase()}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">${crypto.current_price}</TableCell>
              <TableCell className="text-right">
                <div className={`${crypto.priceChangePercent[0] === "-" ? "destructive" : "success" } font-medium text-sm`}>
                  {crypto.priceChangePercent[0] === "-" ? <TrendingDown className="h-3 w-3 mr-1 inline" /> : <TrendingUp className="h-3 w-3 mr-1 inline" />}
                  {crypto.priceChangePercent}%
                </div>
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell">{crypto.volume}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{crypto.marketCap}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )

  const renderCards = (data: CryptoData[]) => (
    <ScrollArea className="h-[600px] w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
        {data.map((crypto) => (
          <Card key={crypto.symbol} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => router.push(`/trade/${crypto.symbol}usdt`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Image src={crypto.image} alt={crypto.name} width={48} height={48} className="rounded-full" />
                  <div>
                    <h3 className="font-semibold text-lg">{crypto.name}</h3>
                    <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </div>                   
                <div className={`${crypto.priceChangePercent[0] === "-" ? "destructive" : "success" } font-medium text-sm`}>
                  {crypto.priceChangePercent[0] === "-" ? <TrendingDown className="h-3 w-3 mr-1 inline" /> : <TrendingUp className="h-3 w-3 mr-1 inline" />}
                  {crypto.priceChangePercent}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="font-medium">${crypto.current_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volume:</span>
                  <span>{crypto.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Market Cap:</span>
                  <span>{crypto.marketCap}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
  
  if (loading) return <CryptoListSkeleton />

  return (
    <div className="w-full space-y-6"> {/* Removed px-4 sm:px-6 lg:px-8 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold">
          {activeTab === "all" ? "All Cryptocurrencies" : `Sorted by ${activeTab === "rank" ? "Market Cap Rank" : activeTab}`}
        </h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className={`hidden sm:block flex-grow ${isSearchExpanded ? 'sm:hidden' : ''}`}>
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className={`relative ${isSearchExpanded ? 'w-full' : 'w-auto'}`}>
            {isSearchExpanded && (
              <Input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-8"
              />
            )}
            <Button
              variant="outline"
              size="icon"
              className={`${isSearchExpanded ? 'absolute right-0 top-0' : ''}`}
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              {isSearchExpanded ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
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
      </div>
      <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full rounded-lg mb-6 overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="rank">Rank</TabsTrigger>
          <TabsTrigger value="24h">24h Change</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="marketCap">Market Cap</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="hidden md:block">
        {renderTable(sortedAndFilteredData)}
      </div>
      <div className="md:hidden">
        {renderCards(sortedAndFilteredData)}
      </div>
    </div>
  )
}