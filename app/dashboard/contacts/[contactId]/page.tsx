"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Contact } from "@/lib/types"

export default function ContactDetailPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const contactId = params.contactId as string
  const [isLoading, setIsLoading] = useState(true)
  const [contact, setContact] = useState<Contact | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    const mockContact: Contact = {
      id: contactId,
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah@example.com",
      status: "active",
      source: "import",
      accountId: "1",
      tags: ["vip", "enterprise"],
      notes: "Premium customer, handles enterprise deals",
      messageCount: 24,
      createdAt: new Date("2024-01-10"),
      lastMessageDate: new Date(Date.now() - 2 * 3600000),
      avatar: "https://avatar.vercel.sh/sarah@example.com",
    }

    setContact(mockContact)
    setIsLoading(false)
  }, [isAuthenticated, router, contactId])

  if (isLoading || !contact) {
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
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
              <Button variant="outline" onClick={() => router.back()} className="mb-6">
                ← Back
              </Button>
              <div className="flex items-start gap-6">
                <img
                  src={contact.avatar || `https://avatar.vercel.sh/${contact.phone}`}
                  alt={contact.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{contact.name}</h1>
                  <p className="text-muted-foreground mt-1">{contact.phone}</p>
                  {contact.email && <p className="text-muted-foreground">{contact.email}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="text-foreground font-medium">{contact.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-foreground font-medium">{contact.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-foreground font-medium capitalize">{contact.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Source</p>
                    <p className="text-foreground font-medium capitalize">{contact.source}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Activity</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Messages</p>
                    <p className="text-3xl font-bold text-foreground">{contact.messageCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                    <p className="text-foreground font-medium">{contact.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Message</p>
                    <p className="text-foreground font-medium">
                      {contact.lastMessageDate
                        ? new Date(contact.lastMessageDate).toLocaleDateString()
                        : "No messages yet"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tags & Labels</h3>
                <div className="space-y-4">
                  {contact.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No tags</p>
                  )}
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Manage Tags
                  </Button>
                </div>
              </Card>
            </div>

            {contact.notes && (
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notes</h3>
                <p className="text-foreground whitespace-pre-wrap">{contact.notes}</p>
              </Card>
            )}

            <Card className="p-6 border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Send Message</Button>
                <Button variant="outline">Edit Contact</Button>
                <Button variant="outline">View History</Button>
                <Button variant="destructive">Block Contact</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
