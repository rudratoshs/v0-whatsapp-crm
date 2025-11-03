"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { label: "Dashboard", icon: "📊", href: "/admin" },
    { label: "Users", icon: "👥", href: "/admin/users" },
    { label: "Analytics", icon: "📈", href: "/admin/analytics" },
    { label: "Subscriptions", icon: "💳", href: "/admin/subscriptions" },
    { label: "Settings", icon: "⚙️", href: "/admin/settings" },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="font-bold text-sidebar-foreground text-lg">WhatsApp CRM Admin</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={user?.avatar || "/placeholder.svg"} alt={user?.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
