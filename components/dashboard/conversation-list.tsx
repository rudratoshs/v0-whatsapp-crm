"use client"

import type { Conversation } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (id: string) => void
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="space-y-2">
      {conversations.length === 0 ? (
        <Card className="p-6 border-border text-center">
          <p className="text-muted-foreground">No conversations yet</p>
        </Card>
      ) : (
        conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full p-4 rounded-lg border transition-colors text-left ${
              selectedConversationId === conversation.id
                ? "bg-primary/10 border-primary"
                : "bg-secondary border-border hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={conversation.contactAvatar || `https://avatar.vercel.sh/${conversation.contactPhone}`}
                alt={conversation.contactName}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground truncate">{conversation.contactName}</h3>
                  {conversation.unreadCount > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {conversation.lastMessageTime?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  )
}
