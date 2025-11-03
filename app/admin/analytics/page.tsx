"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Analytics } from "@/lib/types"

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [analytics] = useState<Analytics[]>([
    {
      date: new Date("2024-12-01"),
      messagesSent: 4200,
      messagesDelivered: 4100,
      messagesRead: 3200,
      messagesFailed: 100,
      conversations: 342,
      averageResponseTime: 2.3,
    },
    {
      date: new Date("2024-12-02"),
      messagesSent: 5100,
      messagesDelivered: 4980,
      messagesRead: 3890,
      messagesFailed: 120,
      conversations: 378,
      averageResponseTime: 2.1,
    },
    {
      date: new Date("2024-12-03"),
      messagesSent: 4800,
      messagesDelivered: 4700,
      messagesRead: 3650,
      messagesFailed: 100,
      conversations: 365,
      averageResponseTime: 2.4,
    },
    {
      date: new Date("2024-12-04"),
      messagesSent: 5600,
      messagesDelivered: 5480,
      messagesRead: 4200,
      messagesFailed: 120,
      conversations: 420,
      averageResponseTime: 2.2,
    },
  ])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, router])

  const chartData = analytics.map((a) => ({
    date: new Date(a.date).toLocaleDateString(),
    sent: a.messagesSent,
    delivered: a.messagesDelivered,
    read: a.messagesRead,
  }))

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics & Reporting</h1>
              <p className="text-muted-foreground mt-2">Platform-wide messaging metrics and insights</p>
            </div>

            <Card className="p-6 border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Message Delivery Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }} />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="read" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics[analytics.length - 1] && (
                <>
                  <Card className="p-6 border-border">
                    <p className="text-sm text-muted-foreground mb-2">Total Sent Today</p>
                    <p className="text-3xl font-bold text-foreground">
                      {analytics[analytics.length - 1].messagesSent.toLocaleString()}
                    </p>
                  </Card>
                  <Card className="p-6 border-border">
                    <p className="text-sm text-muted-foreground mb-2">Delivery Rate</p>
                    <p className="text-3xl font-bold text-green-500">
                      {Math.round(
                        (analytics[analytics.length - 1].messagesDelivered /
                          analytics[analytics.length - 1].messagesSent) *
                          100,
                      )}
                      %
                    </p>
                  </Card>
                  <Card className="p-6 border-border">
                    <p className="text-sm text-muted-foreground mb-2">Read Rate</p>
                    <p className="text-3xl font-bold text-blue-500">
                      {Math.round(
                        (analytics[analytics.length - 1].messagesRead /
                          analytics[analytics.length - 1].messagesDelivered) *
                          100,
                      )}
                      %
                    </p>
                  </Card>
                  <Card className="p-6 border-border">
                    <p className="text-sm text-muted-foreground mb-2">Avg Response Time</p>
                    <p className="text-3xl font-bold text-foreground">
                      {analytics[analytics.length - 1].averageResponseTime}m
                    </p>
                  </Card>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
