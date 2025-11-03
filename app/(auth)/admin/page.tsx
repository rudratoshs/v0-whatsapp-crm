"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Users, Settings, BarChart3, CreditCard } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "admin") return null

  return (
    <DashboardLayout role="admin">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">System management and analytics</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Users", value: "2,456", change: "+12%" },
            { icon: BarChart3, label: "System Uptime", value: "99.9%", change: "Excellent" },
            { icon: CreditCard, label: "Monthly Revenue", value: "$45,231", change: "+8.2%" },
            { icon: Settings, label: "Active Instances", value: "156", change: "+5" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="p-6 border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-accent text-xs mt-2">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Admin sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold text-foreground mb-4">User Management</h2>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </Card>
          <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold text-foreground mb-4">System Settings</h2>
            <p className="text-muted-foreground">Configure system-wide settings and integrations</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
