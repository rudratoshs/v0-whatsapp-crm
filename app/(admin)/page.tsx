"use client"

import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default function AdminDashboard() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System administration and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Total Users</p>
          <p className="text-3xl font-bold mt-2">2,547</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Active Subscriptions</p>
          <p className="text-3xl font-bold mt-2">1,893</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Monthly Revenue</p>
          <p className="text-3xl font-bold mt-2">$127K</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">System Uptime</p>
          <p className="text-3xl font-bold mt-2">99.98%</p>
        </Card>
      </div>
    </div>
  )
}
