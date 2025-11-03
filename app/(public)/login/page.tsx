"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { MessageCircle, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("business@whatsapp-crm.com")
  const [password, setPassword] = useState("password")
  const [role, setRole] = useState<"admin" | "user" | "agent">("user")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password, role)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />

      <div className="relative w-full max-w-md z-10">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageCircle className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            WhatsApp CRM
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Enterprise messaging platform</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-input border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-input border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Login As</label>
              <div className="space-y-2">
                {(["admin", "user", "agent"] as const).map((r) => (
                  <label
                    key={r}
                    className="flex items-center p-4 border border-border/50 rounded-lg cursor-pointer hover:bg-secondary/50 transition-all duration-200 group"
                    style={{
                      borderColor: role === r ? "var(--primary)" : undefined,
                      backgroundColor: role === r ? "var(--primary)/10" : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="mr-3 w-4 h-4"
                    />
                    <div>
                      <span className="text-foreground font-semibold capitalize block">
                        {r === "admin" ? "Admin" : r === "user" ? "Business Owner" : "Support Agent"}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {r === "admin"
                          ? "Full system access"
                          : r === "user"
                            ? "Manage accounts and campaigns"
                            : "Handle conversations"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>

        {/* Demo Info */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Demo credentials are pre-filled. Try different roles to explore each interface.
        </p>
      </div>
    </div>
  )
}
