"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ConversationList } from "@/components/dashboard/conversation-list"
import { ChatWindow } from "@/components/dashboard/chat-window"
import type { Conversation, Message } from "@/lib/types"

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      contactId: "1",
      contactName: "Sarah Johnson",
      contactPhone: "+1 (555) 123-4567",
      contactAvatar: "https://avatar.vercel.sh/sarah@example.com",
      accountId: "1",
      lastMessage: "Thanks for your help! This looks perfect.",
      lastMessageTime: new Date(Date.now() - 15 * 60000),
      unreadCount: 0,
      isActive: true,
      messages: [
        {
          id: "m1",
          conversationId: "1",
          senderId: "1",
          senderName: "Sarah Johnson",
          recipientId: "user1",
          content: "Hi! Do you have any updates on my order?",
          type: "text",
          status: "read",
          timestamp: new Date(Date.now() - 2 * 3600000),
          isFromContact: true,
        },
        {
          id: "m2",
          conversationId: "1",
          senderId: "user1",
          senderName: "Agent",
          recipientId: "1",
          content: "Hi Sarah! Your order is being processed and should ship tomorrow.",
          type: "text",
          status: "read",
          timestamp: new Date(Date.now() - 1.5 * 3600000),
          isFromContact: false,
        },
        {
          id: "m3",
          conversationId: "1",
          senderId: "1",
          senderName: "Sarah Johnson",
          recipientId: "user1",
          content: "Thanks for your help! This looks perfect.",
          type: "text",
          status: "read",
          timestamp: new Date(Date.now() - 15 * 60000),
          isFromContact: true,
        },
      ],
    },
    {
      id: "2",
      contactId: "2",
      contactName: "Michael Chen",
      contactPhone: "+1 (555) 234-5678",
      contactAvatar: "https://avatar.vercel.sh/michael@example.com",
      accountId: "1",
      lastMessage: "Can you provide a quote for bulk order?",
      lastMessageTime: new Date(Date.now() - 2 * 3600000),
      unreadCount: 1,
      isActive: true,
      messages: [
        {
          id: "m4",
          conversationId: "2",
          senderId: "2",
          senderName: "Michael Chen",
          recipientId: "user1",
          content: "Can you provide a quote for bulk order?",
          type: "text",
          status: "delivered",
          timestamp: new Date(Date.now() - 2 * 3600000),
          isFromContact: true,
        },
      ],
    },
  ])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    } else {
      setIsLoading(false)
      if (conversations.length > 0) {
        setSelectedConversationId(conversations[0].id)
      }
    }
  }, [isAuthenticated, router, conversations])

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: user?.id || "user1",
      senderName: user?.name || "Agent",
      recipientId: conversations.find((c) => c.id === selectedConversationId)?.contactId || "",
      content,
      type: "text",
      status: "sent",
      timestamp: new Date(),
      isFromContact: false,
    }

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: content,
            lastMessageTime: new Date(),
          }
        }
        return conv
      }),
    )
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

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex gap-6 p-8">
            {/* Conversations List */}
            <div className="w-80 flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Conversations</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="flex-1 px-3 py-2 text-sm bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <ConversationList
                  conversations={conversations}
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                />
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 min-w-0">
              <ChatWindow conversation={selectedConversation || null} onSendMessage={handleSendMessage} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
