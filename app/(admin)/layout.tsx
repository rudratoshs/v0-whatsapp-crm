import type React from "react"
import type { Metadata } from "next"
import AdminNav from "@/components/admin/admin-nav"

export const metadata: Metadata = {
  title: "Admin Dashboard | WhatsApp CRM",
  description: "System administration panel",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminNav />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
