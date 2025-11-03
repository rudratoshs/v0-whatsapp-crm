"use client"

import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default function AgentPanel() {
  const { user } = useAuth()

  if (!user || user.role !== "agent") {
    redirect("/")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Panel</h1>
        <p className="text-muted-foreground mt-2">Manage customer conversations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Conversations Today</p>
          <p className="text-3xl font-bold mt-2">24</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Avg Response Time</p>
          <p className="text-3xl font-bold mt-2">2.5m</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm">Your Status</p>
          <p className="text-lg font-semibold mt-2 text-green-500">Available</p>
        </Card>
      </div>
    </div>
  )
}
