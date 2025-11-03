"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { MessageCircle, Users, Zap, BarChart3 } from "lucide-react"

export default function BusinessDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "user") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "user") return null

  return (
    <DashboardLayout role="user">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-2">Manage your WhatsApp business efficiently</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MessageCircle, label: "Messages Today", value: "2,451", change: "+15%" },
            { icon: Users, label: "Active Contacts", value: "12,847", change: "+8%" },
            { icon: Zap, label: "Automation Runs", value: "1,234", change: "+22%" },
            { icon: BarChart3, label: "Conversion Rate", value: "3.24%", change: "+2.1%" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="p-6 border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-primary text-xs mt-2">{stat.change} vs last week</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Placeholder sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 border-border/50 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Messages</h2>
            <p className="text-muted-foreground">Message history coming soon...</p>
          </Card>
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Links</h2>
            <div className="space-y-2">
              <a href="#" className="block p-2 text-primary hover:bg-primary/10 rounded transition">
                New Campaign
              </a>
              <a href="#" className="block p-2 text-primary hover:bg-primary/10 rounded transition">
                View Flows
              </a>
              <a href="#" className="block p-2 text-primary hover:bg-primary/10 rounded transition">
                Manage Contacts
              </a>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
