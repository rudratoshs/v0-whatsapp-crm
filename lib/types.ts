export type AccountStatus = "connected" | "disconnected" | "pending" | "expired"
export type QualityRating = "excellent" | "good" | "fair" | "poor"
export type ContactStatus = "active" | "inactive" | "blocked" | "unsubscribed"
export type ContactSource = "manual" | "import" | "form" | "whatsapp" | "api"
export type LeadStage = "prospect" | "interested" | "qualified" | "negotiation" | "customer" | "lost"
export type MessageType = "text" | "image" | "document" | "audio" | "video" | "template"
export type MessageStatus = "sent" | "delivered" | "read" | "failed"
export type NodeType =
  | "start"
  | "end"
  | "text_message"
  | "delay"
  | "condition"
  | "api_call"
  | "webhook"
  | "assign_tag"
  | "remove_tag"
  | "send_template"
  | "media_message"
  | "quick_reply"
  | "button_message"
  | "form"
  | "survey"
  | "wait_for_response"

export interface WhatsAppAccount {
  id: string
  name: string
  phone: string
  status: AccountStatus
  quality: QualityRating
  messagesSent: number
  messagesReceived: number
  lastActivity: Date
  connectedDate?: Date
  businessName?: string
}

export interface WhatsAppConnection {
  accountId: string
  accessToken: string
  phoneNumberId: string
  businessAccountId: string
  expiresAt: Date
}

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  status: ContactStatus
  source: ContactSource
  accountId: string
  tags: string[]
  notes?: string
  avatar?: string
  createdAt: Date
  lastMessageDate?: Date
  messageCount: number
}

export interface Lead extends Contact {
  stage: LeadStage
  value?: number
  assignedTo?: string
  convertedAt?: Date
}

export interface ContactTag {
  id: string
  name: string
  color: string
  accountId: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  recipientId: string
  content: string
  type: MessageType
  status: MessageStatus
  mediaUrl?: string
  timestamp: Date
  isFromContact: boolean
}

export interface Conversation {
  id: string
  contactId: string
  contactName: string
  contactPhone: string
  contactAvatar?: string
  accountId: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  isActive: boolean
  messages: Message[]
}

export interface FlowNode {
  id: string
  type: NodeType
  label: string
  position: { x: number; y: number }
  data: Record<string, any>
  connections: string[]
}

export interface Flow {
  id: string
  name: string
  description?: string
  nodes: FlowNode[]
  edges: Array<{ source: string; target: string }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  accountId: string
}

export interface Campaign {
  id: string
  name: string
  description?: string
  accountId: string
  contacts: Contact[]
  template?: string
  status: "draft" | "scheduled" | "running" | "completed" | "paused"
  scheduledTime?: Date
  sentCount: number
  deliveredCount: number
  readCount: number
  failedCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MessageTemplate {
  id: string
  name: string
  accountId: string
  category: "marketing" | "transactional" | "notification"
  content: string
  variables?: string[]
  approved: boolean
  createdAt: Date
}

export interface Analytics {
  date: Date
  messagesSent: number
  messagesDelivered: number
  messagesRead: number
  messagesFailed: number
  conversations: number
  averageResponseTime: number
  conversionRate?: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "support"
  createdAt: Date
}
