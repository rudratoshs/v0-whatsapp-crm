"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ContactList } from "@/components/dashboard/contact-list"
import { ContactModal } from "@/components/dashboard/contact-modal"
import type { Contact, ContactTag } from "@/lib/types"

export default function ContactsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah@example.com",
      status: "active",
      source: "import",
      accountId: "1",
      tags: ["vip", "enterprise"],
      messageCount: 24,
      createdAt: new Date("2024-01-10"),
      lastMessageDate: new Date(Date.now() - 2 * 3600000),
    },
    {
      id: "2",
      name: "Michael Chen",
      phone: "+1 (555) 234-5678",
      email: "michael@example.com",
      status: "active",
      source: "whatsapp",
      accountId: "1",
      tags: ["lead"],
      messageCount: 8,
      createdAt: new Date("2024-02-05"),
      lastMessageDate: new Date(Date.now() - 24 * 3600000),
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      phone: "+1 (555) 345-6789",
      status: "inactive",
      source: "form",
      accountId: "1",
      tags: ["prospect"],
      messageCount: 3,
      createdAt: new Date("2024-02-15"),
    },
  ])

  const [tags] = useState<ContactTag[]>([
    { id: "1", name: "vip", color: "gold", accountId: "1" },
    { id: "2", name: "enterprise", color: "blue", accountId: "1" },
    { id: "3", name: "lead", color: "green", accountId: "1" },
    { id: "4", name: "prospect", color: "purple", accountId: "1" },
  ])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, router])

  const handleAddContact = (data: Partial<Contact>) => {
    const newContact: Contact = {
      id: String(contacts.length + 1),
      name: data.name || "",
      phone: data.phone || "",
      email: data.email,
      status: "active",
      source: "manual",
      accountId: "1",
      tags: data.tags || [],
      notes: data.notes,
      messageCount: 0,
      createdAt: new Date(),
      avatar: `https://avatar.vercel.sh/${data.phone || data.name}`,
    }
    setContacts([...contacts, newContact])
  }

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
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
                <p className="text-muted-foreground mt-2">Manage your contacts and leads</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Import Contacts</Button>
                <Button
                  onClick={() => setShowContactModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  + Add Contact
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Contacts</p>
                <p className="text-3xl font-bold text-foreground">{contacts.length}</p>
              </Card>
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Active</p>
                <p className="text-3xl font-bold text-green-500">
                  {contacts.filter((c) => c.status === "active").length}
                </p>
              </Card>
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Inactive</p>
                <p className="text-3xl font-bold text-gray-500">
                  {contacts.filter((c) => c.status === "inactive").length}
                </p>
              </Card>
              <Card className="p-6 border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Messages</p>
                <p className="text-3xl font-bold text-foreground">
                  {contacts.reduce((sum, c) => sum + c.messageCount, 0)}
                </p>
              </Card>
            </div>

            <ContactList contacts={contacts} />
          </div>
        </main>
      </div>
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSave={handleAddContact}
        tags={tags}
      />
    </div>
  )
}
