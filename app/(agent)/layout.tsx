import type React from "react"
import type { Metadata } from "next"
import AgentNav from "@/components/agent/agent-nav"

export const metadata: Metadata = {
  title: "Agent Panel | WhatsApp CRM",
  description: "Support agent interface",
}

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AgentNav />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
