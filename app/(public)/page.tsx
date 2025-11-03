"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Route to appropriate dashboard based on role
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "agent") {
        router.push("/agent")
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  return null
}
