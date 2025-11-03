"use client"

import { useState, useRef, useEffect } from "react"
import type { Conversation } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageBubble } from "./message-bubble"

interface ChatWindowProps {
  conversation: Conversation | null
  onSendMessage: (content: string) => void
}

export function ChatWindow({ conversation, onSendMessage }: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  if (!conversation) {
    return (
      <Card className="h-full border-border flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      </Card>
    )
  }

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput)
      setMessageInput("")
    }
  }

  return (
    <Card className="h-full border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src={conversation.contactAvatar || `https://avatar.vercel.sh/${conversation.contactPhone}`}
            alt={conversation.contactName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-foreground">{conversation.contactName}</h2>
            <p className="text-xs text-muted-foreground">{conversation.contactPhone}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          conversation.messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  )
}
