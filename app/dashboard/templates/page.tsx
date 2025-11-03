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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MessageTemplate } from "@/lib/types"

export default function TemplatesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "Welcome",
      accountId: "1",
      category: "transactional",
      content: "Welcome to {{company_name}}! Your account is ready.",
      variables: ["company_name"],
      approved: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Order Confirmation",
      accountId: "1",
      category: "transactional",
      content: "Order #{{order_id}} confirmed. Total: {{amount}}",
      variables: ["order_id", "amount"],
      approved: true,
      createdAt: new Date(),
    },
  ])
  const [newTemplate, setNewTemplate] = useState({ name: "", content: "", category: "marketing" })

  useEffect(() => {
    if (!isAuthenticated) router.push("/")
    else setIsLoading(false)
  }, [isAuthenticated, router])

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
                <h1 className="text-3xl font-bold text-foreground">Message Templates</h1>
                <p className="text-muted-foreground mt-2">Pre-approved templates for faster messaging</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ New Template</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Message Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Template name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    />
                    <Select
                      value={newTemplate.category}
                      onValueChange={(v) => setNewTemplate({ ...newTemplate, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="transactional">Transactional</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Message content (use {{variable}} for dynamic content)"
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                      rows={5}
                    />
                    <Button
                      onClick={() => {
                        setTemplates([
                          ...templates,
                          {
                            id: String(templates.length + 1),
                            ...newTemplate,
                            accountId: "1",
                            variables: [],
                            approved: false,
                            createdAt: new Date(),
                          },
                        ])
                        setNewTemplate({ name: "", content: "", category: "marketing" })
                      }}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Create Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="p-6 border-border hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            template.approved ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                          }`}
                        >
                          {template.approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.content}</p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{template.category}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
