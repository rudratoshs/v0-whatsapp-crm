import type React from "react"
import type { Metadata } from "next"
import DashboardNav from "@/components/dashboard/dashboard-nav"

export const metadata: Metadata = {
  title: "Dashboard | WhatsApp CRM",
  description: "Business owner dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardNav />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
