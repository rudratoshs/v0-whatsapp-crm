"use client"

import type { Message } from "@/lib/types"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return "✓"
      case "delivered":
        return "✓✓"
      case "read":
        return "✓✓"
      case "failed":
        return "✗"
      default:
        return ""
    }
  }

  const statusColors = {
    sent: "text-gray-500",
    delivered: "text-gray-500",
    read: "text-blue-500",
    failed: "text-red-500",
  }

  return (
    <div className={`flex gap-3 mb-4 ${message.isFromContact ? "justify-start" : "justify-end"}`}>
      {message.isFromContact && message.senderAvatar && (
        <img
          src={message.senderAvatar || "/placeholder.svg"}
          alt={message.senderName}
          className="w-8 h-8 rounded-full"
        />
      )}

      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          message.isFromContact
            ? "bg-secondary text-foreground border border-border"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <p className="break-words text-sm">{message.content}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
          <p className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          {!message.isFromContact && (
            <span className={`text-xs font-semibold ${statusColors[message.status as keyof typeof statusColors]}`}>
              {getStatusIcon(message.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
