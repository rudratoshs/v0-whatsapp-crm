"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { WhatsAppAccount } from "@/lib/types"

export default function AccountDetailPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const accountId = params.accountId as string
  const [isLoading, setIsLoading] = useState(true)
  const [account, setAccount] = useState<WhatsAppAccount | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Simulate fetching account data
    const mockAccount: WhatsAppAccount = {
      id: accountId,
      name: "Main Business",
      phone: "+1 (555) 123-4567",
      status: "connected",
      quality: "excellent",
      messagesSent: 12450,
      messagesReceived: 8932,
      lastActivity: new Date(),
      connectedDate: new Date("2024-01-15"),
      businessName: "Acme Corp",
    }

    setAccount(mockAccount)
    setIsLoading(false)
  }, [isAuthenticated, router, accountId])

  if (isLoading || !account) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
              <Button variant="outline" onClick={() => router.back()} className="mb-6">
                ← Back
              </Button>
              <h1 className="text-3xl font-bold text-foreground">{account.name}</h1>
              <p className="text-muted-foreground mt-2">{account.phone}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="text-foreground font-medium">{account.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p className="text-foreground font-medium">{account.businessName || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-foreground font-medium capitalize">{account.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connected Date</p>
                    <p className="text-foreground font-medium">{account.connectedDate?.toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Quality Metrics</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Quality Rating</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width:
                              account.quality === "excellent" ? "100%" : account.quality === "good" ? "75%" : "50%",
                          }}
                        ></div>
                      </div>
                      <span className="text-foreground font-medium capitalize">{account.quality}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Messages Sent</p>
                    <p className="text-2xl font-bold text-foreground">{account.messagesSent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Messages Received</p>
                    <p className="text-2xl font-bold text-foreground">{account.messagesReceived.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Edit Account</Button>
                <Button variant="outline">View Conversations</Button>
                <Button variant="outline">Account Settings</Button>
                <Button variant="destructive">Disconnect Account</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
