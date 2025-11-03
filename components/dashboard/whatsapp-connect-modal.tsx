"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WhatsAppConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (data: any) => void
}

export function WhatsAppConnectModal({ isOpen, onClose, onConnect }: WhatsAppConnectModalProps) {
  const [step, setStep] = useState<"method" | "phone" | "verification">("method")
  const [phone, setPhone] = useState("")
  const [accountName, setAccountName] = useState("")

  if (!isOpen) return null

  const handleConnect = () => {
    if (step === "method") {
      setStep("phone")
    } else if (step === "phone") {
      setStep("verification")
    } else {
      onConnect({ phone, accountName })
      setStep("method")
      setPhone("")
      setAccountName("")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">Connect WhatsApp Account</h2>

        {step === "method" && (
          <div className="space-y-4">
            <p className="text-muted-foreground">Choose how you want to connect your WhatsApp account:</p>
            <div className="space-y-3">
              <button className="w-full p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                <p className="font-medium text-foreground">Business Account (Recommended)</p>
                <p className="text-sm text-muted-foreground">Connect via WhatsApp Business API</p>
              </button>
              <button className="w-full p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                <p className="font-medium text-foreground">Phone Number</p>
                <p className="text-sm text-muted-foreground">Connect using your phone number</p>
              </button>
            </div>
          </div>
        )}

        {step === "phone" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g., Main Business"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
              />
            </div>
          </div>
        )}

        {step === "verification" && (
          <div className="space-y-4">
            <p className="text-muted-foreground">We sent a verification code to {phone}</p>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Verification Code</label>
              <input
                type="text"
                placeholder="000000"
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground text-center text-2xl letter-spacing-2"
                maxLength={6}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Didn't receive the code? <button className="text-primary hover:underline">Resend</button>
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleConnect} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            {step === "verification" ? "Connect" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
