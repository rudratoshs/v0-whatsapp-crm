"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Campaign } from "@/lib/types"

export default function CampaignDetailPage({ params }: { params: { campaignId: string } }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [campaign, setCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push("/")
    else {
      setCampaign({
        id: params.campaignId,
        name: "Summer Sale 2024",
        description: "Promote summer collection",
        accountId: "1",
        contacts: [],
        status: "completed",
        sentCount: 1250,
        deliveredCount: 1189,
        readCount: 456,
        failedCount: 12,
        createdAt: new Date("2024-06-01"),
        updatedAt: new Date(),
      })
      setIsLoading(false)
    }
  }, [isAuthenticated, router, params.campaignId])

  if (isLoading || !campaign) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const deliveryData = [
    { name: "Delivered", value: campaign.deliveredCount },
    { name: "Failed", value: campaign.failedCount },
  ]

  const engagementData = [
    { name: "Sent", value: campaign.sentCount },
    { name: "Delivered", value: campaign.deliveredCount },
    { name: "Read", value: campaign.readCount },
  ]

  const COLORS = ["#10B981", "#EF4444"]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
                <p className="text-muted-foreground mt-2">{campaign.description}</p>
              </div>
              <Button variant="outline">Edit Campaign</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Sent</p>
                <p className="text-3xl font-bold text-foreground">{campaign.sentCount.toLocaleString()}</p>
              </Card>
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Delivered</p>
                <p className="text-3xl font-bold text-green-500">{campaign.deliveredCount.toLocaleString()}</p>
              </Card>
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Read</p>
                <p className="text-3xl font-bold text-blue-500">{campaign.readCount.toLocaleString()}</p>
              </Card>
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Failed</p>
                <p className="text-3xl font-bold text-red-500">{campaign.failedCount.toLocaleString()}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Delivery Status</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deliveryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Engagement Funnel</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937" }} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
