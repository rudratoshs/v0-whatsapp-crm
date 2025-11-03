"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Campaign } from "@/lib/types"

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Campaign>) => void
}

export function CampaignModal({ isOpen, onClose, onSave }: CampaignModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accountId: "1",
    status: "draft" as const,
  })

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Campaign name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            placeholder="Campaign description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
            Create Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
