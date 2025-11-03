"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CampaignModal } from "@/components/dashboard/campaign-modal"
import type { Campaign } from "@/lib/types"
import Link from "next/link"

export default function CampaignsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
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
    },
    {
      id: "2",
      name: "Weekly Newsletter",
      description: "Send weekly updates to subscribers",
      accountId: "1",
      contacts: [],
      status: "running",
      sentCount: 3420,
      deliveredCount: 3380,
      readCount: 1245,
      failedCount: 18,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date(),
    },
  ])

  useEffect(() => {
    if (!isAuthenticated) router.push("/")
    else setIsLoading(false)
  }, [isAuthenticated, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500/10 text-gray-600"
      case "scheduled":
        return "bg-blue-500/10 text-blue-600"
      case "running":
        return "bg-yellow-500/10 text-yellow-600"
      case "completed":
        return "bg-green-500/10 text-green-600"
      case "paused":
        return "bg-orange-500/10 text-orange-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
                <p className="text-muted-foreground mt-2">Create and manage bulk messaging campaigns</p>
              </div>
              <Button
                onClick={() => setShowCampaignModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                + New Campaign
              </Button>
            </div>

            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`}>
                  <Card className="p-6 border-border hover:bg-secondary/50 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                          {campaign.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Sent</p>
                        <p className="text-lg font-semibold text-foreground">{campaign.sentCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                        <p className="text-lg font-semibold text-green-500">
                          {campaign.deliveredCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Read</p>
                        <p className="text-lg font-semibold text-blue-500">{campaign.readCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Failed</p>
                        <p className="text-lg font-semibold text-red-500">{campaign.failedCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rate</p>
                        <p className="text-lg font-semibold text-foreground">
                          {Math.round((campaign.deliveredCount / campaign.sentCount) * 100)}%
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <CampaignModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        onSave={(data) => {
          setCampaigns([
            ...campaigns,
            {
              id: String(campaigns.length + 1),
              ...data,
              sentCount: 0,
              deliveredCount: 0,
              readCount: 0,
              failedCount: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ])
          setShowCampaignModal(false)
        }}
      />
    </div>
  )
}
