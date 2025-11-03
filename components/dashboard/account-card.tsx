"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AccountCard() {
  const [accounts] = useState([
    {
      id: "1",
      name: "Main Business",
      phone: "+1 (555) 123-4567",
      status: "connected",
      quality: "excellent",
    },
    {
      id: "2",
      name: "Support Team",
      phone: "+1 (555) 234-5678",
      status: "connected",
      quality: "good",
    },
    {
      id: "3",
      name: "Sales Team",
      phone: "+1 (555) 345-6789",
      status: "disconnected",
      quality: "poor",
    },
  ])

  const statusColors = {
    connected: "text-green-500",
    disconnected: "text-red-500",
    pending: "text-yellow-500",
  }

  const qualityColors = {
    excellent: "bg-green-500/10 text-green-600",
    good: "bg-blue-500/10 text-blue-600",
    poor: "bg-red-500/10 text-red-600",
  }

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">WhatsApp Accounts</h3>
        <Button size="sm">+ Add Account</Button>
      </div>

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{account.name}</p>
              <p className="text-sm text-muted-foreground">{account.phone}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${statusColors[account.status as keyof typeof statusColors]}`}>
                {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${qualityColors[account.quality as keyof typeof qualityColors]}`}
              >
                {account.quality.charAt(0).toUpperCase() + account.quality.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
