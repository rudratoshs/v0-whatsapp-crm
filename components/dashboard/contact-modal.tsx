"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Contact, ContactTag } from "@/lib/types"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Contact>) => void
  tags: ContactTag[]
}

export function ContactModal({ isOpen, onClose, onSave, tags }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    selectedTags: [] as string[],
    notes: "",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      tags: formData.selectedTags,
      notes: formData.notes,
    })
    setFormData({ name: "", phone: "", email: "", selectedTags: [], notes: "" })
    onClose()
  }

  const toggleTag = (tagName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagName)
        ? prev.selectedTags.filter((t) => t !== tagName)
        : [...prev.selectedTags, tagName],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 border-border max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-foreground mb-4">Add Contact</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              required
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    formData.selectedTags.includes(tag.name)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground border border-border"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this contact..."
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Contact
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
