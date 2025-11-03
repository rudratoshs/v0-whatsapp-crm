"use client"

import type { User } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RoleBasedContentProps {
  user: User | null
}

export function RoleBasedContent({ user }: RoleBasedContentProps) {
  if (!user) return null

  if (user.role === "admin") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-foreground">1,284</p>
            <p className="text-xs text-accent mt-2">+12% from last month</p>
          </Card>
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">System Health</h3>
            <p className="text-3xl font-bold text-green-500">99.9%</p>
            <p className="text-xs text-accent mt-2">Uptime</p>
          </Card>
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Campaigns</h3>
            <p className="text-3xl font-bold text-foreground">47</p>
            <p className="text-xs text-accent mt-2">Across all accounts</p>
          </Card>
        </div>

        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Admin Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start">Manage Users</Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              System Settings
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              View Logs
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (user.role === "user") {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Your Business Overview</h3>
          <p className="text-muted-foreground mb-4">Get started managing your WhatsApp accounts and contacts</p>
          <div className="grid grid-cols-2 gap-4">
            <Button>Connect WhatsApp Account</Button>
            <Button variant="outline">Import Contacts</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <p className="text-foreground">
                Contacts: <span className="font-bold">0</span>
              </p>
              <p className="text-foreground">
                Messages: <span className="font-bold">0</span>
              </p>
            </div>
          </Card>
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </Card>
        </div>
      </div>
    )
  }

  if (user.role === "agent") {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Support Agent Dashboard</h3>
          <p className="text-muted-foreground mb-4">Your active conversations and tasks</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned Chats</h3>
            <p className="text-3xl font-bold text-foreground">0</p>
          </Card>
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg Response</h3>
            <p className="text-3xl font-bold text-foreground">--</p>
          </Card>
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
            <p className="text-lg font-bold text-green-500">Online</p>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
