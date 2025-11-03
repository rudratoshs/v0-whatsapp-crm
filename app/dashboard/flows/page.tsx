"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Flow } from "@/lib/types"
import Link from "next/link"

export default function FlowsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: "1",
      name: "Welcome Sequence",
      description: "Greet new customers and send product info",
      nodes: [],
      edges: [],
      isActive: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date(),
      accountId: "1",
    },
    {
      id: "2",
      name: "Support Ticket Flow",
      description: "Route support requests to agents",
      nodes: [],
      edges: [],
      isActive: true,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date(),
      accountId: "1",
    },
    {
      id: "3",
      name: "Abandoned Cart",
      description: "Recover abandoned cart items",
      nodes: [],
      edges: [],
      isActive: false,
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date(),
      accountId: "1",
    },
  ])
  const [newFlowName, setNewFlowName] = useState("")

  useEffect(() => {
    if (!isAuthenticated) router.push("/")
    else setIsLoading(false)
  }, [isAuthenticated, router])

  const handleCreateFlow = () => {
    if (!newFlowName.trim()) return
    const newFlow: Flow = {
      id: String(flows.length + 1),
      name: newFlowName,
      nodes: [],
      edges: [],
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      accountId: "1",
    }
    setFlows([...flows, newFlow])
    setNewFlowName("")
  }

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Automation Flows</h1>
                <p className="text-muted-foreground mt-2">Create and manage automated messaging workflows</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ Create Flow</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Flow</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Flow name"
                      value={newFlowName}
                      onChange={(e) => setNewFlowName(e.target.value)}
                    />
                    <Button onClick={handleCreateFlow} className="w-full bg-primary hover:bg-primary/90">
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {flows.map((flow) => (
                <Link key={flow.id} href={`/dashboard/flows/${flow.id}`}>
                  <Card className="p-6 border-border hover:bg-secondary/50 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {flow.name}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              flow.isActive ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"
                            }`}
                          >
                            {flow.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{flow.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(flow.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
