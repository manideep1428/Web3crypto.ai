'use client'

import { BellIcon, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  // In a real application, you'd fetch notifications here.
  // For now, we'll simulate different states.
  const notifications: any[] = [] // Simulate no notifications
  const loading = false // Simulate loading complete
  const error = null // Simulate no error

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600">
        <XCircle className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error Loading Notifications</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border-b last:border-b-0">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BellIcon className="w-6 h-6 mr-2" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BellIcon className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No New Notifications</h2>
            <p className="text-muted-foreground">
              You're all caught up! We'll let you know when there's something new.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((notification) => (
              <li key={notification.id} className="py-4">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
