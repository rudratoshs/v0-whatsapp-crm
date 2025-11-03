"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const testAccounts = [
    { email: "admin@whatsapp-crm.com", password: "Admin@123456", role: "Super Admin" },
    { email: "business@whatsapp-crm.com", password: "Business@123456", role: "Business Owner" },
    { email: "agent@whatsapp-crm.com", password: "Agent@123456", role: "Support Agent" },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated && mounted) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, mounted])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">W</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">WhatsApp CRM</h1>
          <p className="text-slate-400 mt-2">Manage your WhatsApp business efficiently</p>
        </div>

        <Card className="p-8 border-slate-700 bg-slate-800">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-xs text-slate-400 font-semibold mb-3">TEST CREDENTIALS</p>
            <div className="space-y-2">
              {testAccounts.map((account, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTestLogin(account.email, account.password)}
                  className="w-full p-3 text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors group"
                >
                  <div className="text-sm font-medium text-slate-100 group-hover:text-green-400">{account.role}</div>
                  <div className="text-xs text-slate-400 group-hover:text-slate-300">{account.email}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <p className="text-center text-slate-400 text-xs mt-6">Demo credentials available. Click above to auto-fill.</p>

        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-green-400 hover:text-green-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
