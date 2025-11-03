"use client"

import { useState } from "react"
import type { Contact } from "@/lib/types"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface ContactListProps {
  contacts: Contact[]
  onDelete?: (id: string) => void
}

export function ContactList({ contacts, onDelete }: ContactListProps) {
  const [filteredContacts, setFilteredContacts] = useState(contacts)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(term.toLowerCase()) ||
        contact.phone.includes(term) ||
        contact.email?.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredContacts(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/30"
      case "inactive":
        return "bg-gray-500/10 text-gray-600 border-gray-500/30"
      case "blocked":
        return "bg-red-500/10 text-red-600 border-red-500/30"
      case "unsubscribed":
        return "bg-orange-500/10 text-orange-600 border-orange-500/30"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search contacts by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {filteredContacts.length === 0 ? (
        <Card className="p-12 border-border text-center">
          <p className="text-muted-foreground">No contacts found</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredContacts.map((contact) => (
            <Link key={contact.id} href={`/dashboard/contacts/${contact.id}`}>
              <Card className="p-4 border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={contact.avatar || `https://avatar.vercel.sh/${contact.phone}`}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      {contact.email && <p className="text-xs text-muted-foreground">{contact.email}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Messages</p>
                      <p className="text-lg font-semibold text-foreground">{contact.messageCount}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}
                    >
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                    {contact.tags.length > 0 && (
                      <div className="flex gap-1">
                        {contact.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">
                            {tag}
                          </span>
                        ))}
                        {contact.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs text-muted-foreground">+{contact.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
