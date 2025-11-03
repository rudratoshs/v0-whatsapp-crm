"use client"

import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default function Dashboard() {
  const { user } = useAuth()

  if (!user || user.role !== "user") {
    redirect("/")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, {user.name}</h1>
        <p className="text-muted-foreground mt-2">Manage your WhatsApp campaigns and contacts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Connected Accounts</p>
          <p className="text-3xl font-bold mt-2">2</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Total Contacts</p>
          <p className="text-3xl font-bold mt-2">12,547</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Messages Sent Today</p>
          <p className="text-3xl font-bold mt-2">3,421</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Engagement Rate</p>
          <p className="text-3xl font-bold mt-2">34.2%</p>
        </Card>
      </div>
    </div>
  )
}
