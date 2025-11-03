"use client"

import { Card } from "@/components/ui/card"
import type { User } from "@/lib/auth-context"

interface OverviewSectionProps {
  user: User | null
}

export function OverviewSection({ user }: OverviewSectionProps) {
  const metrics = [
    { label: "Active Accounts", value: "3", change: "+2 this month" },
    { label: "Total Contacts", value: "1,284", change: "+156 this week" },
    { label: "Messages Sent", value: "45.2K", change: "+12% this week" },
    { label: "Avg Response Time", value: "2.3m", change: "-15% vs last week" },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6 border-border">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
              <p className="text-3xl font-bold text-foreground mt-2">{metric.value}</p>
              <p className="text-xs text-accent mt-2">{metric.change}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
