"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            <Card className="p-6 border-border space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                    <input
                      type="text"
                      value={user?.role || ""}
                      disabled
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground capitalize"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">Email notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">Marketing updates</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Danger Zone</h2>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
