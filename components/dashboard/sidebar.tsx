"use client"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"

interface NavItem {
  label: string
  icon: string
  href: string
  active?: boolean
}

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { label: "Overview", icon: "📊", href: "/dashboard", active: pathname === "/dashboard" },
    { label: "Accounts", icon: "📱", href: "/dashboard/accounts", active: pathname.startsWith("/dashboard/accounts") },
    { label: "Contacts", icon: "👥", href: "/dashboard/contacts", active: pathname.startsWith("/dashboard/contacts") },
    { label: "Messages", icon: "💬", href: "/dashboard/messages", active: pathname.startsWith("/dashboard/messages") },
    { label: "Campaigns", icon: "📢", href: "/dashboard/campaigns" },
    { label: "Flows", icon: "🔄", href: "/dashboard/flows" },
    { label: "Templates", icon: "📝", href: "/dashboard/templates" },
    { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">W</span>
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">WhatsApp CRM</h1>
            <p className="text-xs text-muted-foreground">v1.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || `https://avatar.vercel.sh/${user?.email}`}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
