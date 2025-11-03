"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WhatsAppConnectModal } from "@/components/dashboard/whatsapp-connect-modal"
import type { WhatsAppAccount } from "@/lib/types"
import Link from "next/link"

export default function AccountsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([
    {
      id: "1",
      name: "Main Business",
      phone: "+1 (555) 123-4567",
      status: "connected",
      quality: "excellent",
      messagesSent: 12450,
      messagesReceived: 8932,
      lastActivity: new Date(Date.now() - 5 * 60000),
      connectedDate: new Date("2024-01-15"),
      businessName: "Acme Corp",
    },
    {
      id: "2",
      name: "Support Team",
      phone: "+1 (555) 234-5678",
      status: "connected",
      quality: "good",
      messagesSent: 5620,
      messagesReceived: 4105,
      lastActivity: new Date(Date.now() - 30 * 60000),
      connectedDate: new Date("2024-02-20"),
    },
    {
      id: "3",
      name: "Sales Team",
      phone: "+1 (555) 345-6789",
      status: "pending",
      quality: "fair",
      messagesSent: 0,
      messagesReceived: 0,
      lastActivity: new Date(Date.now() - 2 * 3600000),
    },
  ])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, router])

  const handleConnect = (data: any) => {
    const newAccount: WhatsAppAccount = {
      id: String(accounts.length + 1),
      name: data.accountName,
      phone: data.phone,
      status: "pending",
      quality: "fair",
      messagesSent: 0,
      messagesReceived: 0,
      lastActivity: new Date(),
      connectedDate: new Date(),
    }
    setAccounts([...accounts, newAccount])
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/10 text-green-600 border-green-500/30"
      case "disconnected":
        return "bg-red-500/10 text-red-600 border-red-500/30"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
      case "expired":
        return "bg-orange-500/10 text-orange-600 border-orange-500/30"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/30"
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "fair":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  if (isLoading) {
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
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">WhatsApp Accounts</h1>
                <p className="text-muted-foreground mt-2">Manage your connected WhatsApp business accounts</p>
              </div>
              <Button
                onClick={() => setShowConnectModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                + Connect Account
              </Button>
            </div>

            {accounts.length === 0 ? (
              <Card className="p-12 border-border text-center">
                <p className="text-muted-foreground mb-4">No WhatsApp accounts connected yet</p>
                <Button
                  onClick={() => setShowConnectModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Connect Your First Account
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {accounts.map((account) => (
                  <Link key={account.id} href={`/dashboard/accounts/${account.id}`}>
                    <Card className="p-6 border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(account.status)}`}
                            >
                              {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3">{account.phone}</p>
                          {account.businessName && (
                            <p className="text-sm text-muted-foreground mb-3">Business: {account.businessName}</p>
                          )}

                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Messages Sent</p>
                              <p className="text-lg font-semibold text-foreground">
                                {account.messagesSent.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Messages Received</p>
                              <p className="text-lg font-semibold text-foreground">
                                {account.messagesReceived.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Quality Rating</p>
                              <p className={`text-lg font-semibold ${getQualityColor(account.quality)}`}>
                                {account.quality.charAt(0).toUpperCase() + account.quality.slice(1)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Last Activity</p>
                              <p className="text-sm text-foreground">{account.lastActivity.toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <WhatsAppConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={handleConnect}
      />
    </div>
  )
}
