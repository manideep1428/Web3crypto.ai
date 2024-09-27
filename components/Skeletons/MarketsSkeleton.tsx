"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown } from "lucide-react"

export default function CryptoListSkeleton() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full md:w-3/4 lg:w-1/2 rounded-lg mb-6">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="rank">Rank</TabsTrigger>
        <TabsTrigger value="24h">24h Change</TabsTrigger>
        <TabsTrigger value="volume">Volume</TabsTrigger>
        <TabsTrigger value="marketCap">Market Cap</TabsTrigger>
      </TabsList>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-64" />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center text-sm"
            disabled
          >
            <ArrowDown className="h-4 w-4 mr-1" />
            <Skeleton className="h-4 w-16" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableBody>
              {[...Array(12)].map((_, index) => (
                <TableRow key={index} className="hover:bg-gray-100 hover:dark:bg-gray-900">
                  <TableCell className="font-medium flex items-center space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24 hidden sm:inline-block" />
                    <Skeleton className="h-4 w-12 sm:hidden" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    <Skeleton className="h-4 w-28 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Tabs>
  )
}