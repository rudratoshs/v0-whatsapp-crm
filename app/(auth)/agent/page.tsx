"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function AgentDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "agent") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "agent") return null

  return (
    <DashboardLayout role="agent">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Support Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your conversations</p>
        </div>

        {/* Agent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MessageCircle, label: "Open Chats", value: "12", change: "Respond now" },
            { icon: Clock, label: "Avg Response", value: "2.3min", change: "Very good" },
            { icon: CheckCircle, label: "Resolved", value: "48", change: "Today" },
            { icon: AlertCircle, label: "Pending", value: "3", change: "Urgent" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="p-6 border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-primary text-xs mt-2">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Inbox placeholder */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
          <h2 className="text-xl font-bold text-foreground mb-4">Inbox</h2>
          <p className="text-muted-foreground">Live chat conversations coming soon...</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
