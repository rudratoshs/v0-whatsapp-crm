"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FlowBuilder } from "@/components/dashboard/flow-builder"
import type { Flow } from "@/lib/types"

export default function FlowEditorPage({ params }: { params: { flowId: string } }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [flow, setFlow] = useState<Flow | null>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push("/")
    else {
      // Simulate fetching flow
      setFlow({
        id: params.flowId,
        name: "Welcome Sequence",
        description: "Greet new customers",
        nodes: [
          {
            id: "start",
            type: "start",
            label: "Start",
            position: { x: 100, y: 100 },
            data: {},
            connections: ["msg1"],
          },
          {
            id: "msg1",
            type: "text_message",
            label: "Send Welcome Message",
            position: { x: 100, y: 250 },
            data: { message: "Welcome!" },
            connections: ["end"],
          },
          {
            id: "end",
            type: "end",
            label: "End",
            position: { x: 100, y: 400 },
            data: {},
            connections: [],
          },
        ],
        edges: [
          { source: "start", target: "msg1" },
          { source: "msg1", target: "end" },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: "1",
      })
      setIsLoading(false)
    }
  }, [isAuthenticated, router, params.flowId])

  if (isLoading || !flow) {
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
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-hidden">
            <FlowBuilder flow={flow} setFlow={setFlow} />
          </main>

          {/* Node Properties Panel */}
          <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Node Library</h3>
            <div className="space-y-2">
              {["Start", "Text Message", "Delay", "Condition", "Send Template", "API Call", "End"].map((node) => (
                <Card
                  key={node}
                  className="p-3 border-border cursor-move hover:bg-secondary/50 transition-colors"
                  draggable
                >
                  <p className="text-sm font-medium text-foreground">{node}</p>
                </Card>
              ))}
            </div>
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Save Flow</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
