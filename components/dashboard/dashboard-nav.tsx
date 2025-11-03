"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Accounts", href: "/accounts" },
    { label: "Contacts", href: "/contacts" },
    { label: "Campaigns", href: "/campaigns" },
    { label: "Flows", href: "/flows" },
    { label: "Templates", href: "/templates" },
    { label: "Analytics", href: "/analytics" },
    { label: "Settings", href: "/settings" },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
          <span className="text-sidebar-primary-foreground font-bold">WA</span>
        </div>
        <div>
          <h2 className="font-bold text-sidebar-foreground">WhatsApp CRM</h2>
          <p className="text-xs text-sidebar-accent-foreground">Business</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border pt-4">
        <div className="text-sm">
          <p className="text-sidebar-accent-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Business Owner</p>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          Logout
        </Button>
      </div>
    </aside>
  )
}
