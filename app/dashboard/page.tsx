"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { OverviewSection } from "@/components/dashboard/overview-section"
import { AccountCard } from "@/components/dashboard/account-card"
import { HealthMetrics } from "@/components/dashboard/health-metrics"
import { RoleBasedContent } from "@/components/dashboard/role-based-content"

export default function DashboardPage() {
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
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            <RoleBasedContent user={user} />
            {user?.role === "user" && (
              <>
                <OverviewSection user={user} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AccountCard />
                  <HealthMetrics />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
