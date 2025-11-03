"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AdminUser } from "@/lib/types"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "1",
      email: "john@admin.com",
      name: "John Admin",
      role: "super_admin",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      email: "jane@admin.com",
      name: "Jane Moderator",
      role: "admin",
      createdAt: new Date("2024-02-15"),
    },
  ])
  const [stats] = useState({
    totalUsers: 1543,
    activeAccounts: 342,
    totalMessages: 156820,
    activeSubscriptions: 287,
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">System administration and user management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats).map(([key, value]) => (
                <Card key={key} className="p-6 border-border">
                  <p className="text-sm text-muted-foreground capitalize mb-2">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Admin Users</h2>
                <Button className="bg-primary hover:bg-primary/90">+ Add Admin</Button>
              </div>
              <div className="space-y-3">
                {users.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {admin.role}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
