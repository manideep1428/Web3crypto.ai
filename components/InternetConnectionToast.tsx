'use client'

import { useEffect, useState } from 'react'
import { Toast, ToastDescription, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function InternetConnectionToast() {
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Please check your network settings.",
        duration: Infinity,
      })
    }
  }, [isOnline ,toast])

  return (
    <ToastProvider>
      <ToastViewport className="top-0 right-0 flex flex-col gap-2 w-full md:max-w-[420px] p-4" />
    </ToastProvider>
  )
}