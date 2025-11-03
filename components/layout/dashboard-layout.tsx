"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { MessageCircle, BarChart3, Settings, Users, LogOut, Menu, X } from "lucide-react"

type DashboardRole = "admin" | "user" | "agent"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: DashboardRole
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigationItems = {
    admin: [
      { icon: Users, label: "Users", href: "#" },
      { icon: BarChart3, label: "Analytics", href: "#" },
      { icon: Settings, label: "Settings", href: "#" },
    ],
    user: [
      { icon: MessageCircle, label: "Messages", href: "#" },
      { icon: Users, label: "Contacts", href: "#" },
      { icon: BarChart3, label: "Campaigns", href: "#" },
      { icon: Settings, label: "Settings", href: "#" },
    ],
    agent: [
      { icon: MessageCircle, label: "Inbox", href: "#" },
      { icon: Users, label: "Contacts", href: "#" },
      { icon: Settings, label: "Settings", href: "#" },
    ],
  }

  const roleTitle = {
    admin: "Admin Panel",
    user: "Business Dashboard",
    agent: "Support Panel",
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-accent rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground text-lg">CRM</span>
          </div>

          <nav className="space-y-2">
            {navigationItems[role].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <h2 className="text-xl font-bold text-foreground">{roleTitle[role]}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={user?.avatar || ""} alt={user?.name || ""} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-foreground text-sm font-medium">{user?.name}</p>
                <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={logout} className="text-foreground bg-transparent">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
