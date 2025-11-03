"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth-context"

interface HeaderProps {
  user: User | null
}

export function Header({ user }: HeaderProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
