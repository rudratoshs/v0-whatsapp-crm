"use client"

import type React from "react"
import { createContext, useContext, useCallback, useState, useEffect } from "react"
import { supabase } from "./supabase/client"

export type UserRole = "super_admin" | "admin" | "user" | "agent" | "manager"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  tenant_id?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, full_name: string, tenantId?: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          // Fetch user profile from database
          const { data: userProfile } = await supabase.from("users").select("*").eq("id", authUser.id).single()

          if (userProfile) {
            setUser({
              id: userProfile.id,
              email: userProfile.email,
              full_name: userProfile.full_name,
              role: userProfile.role,
              tenant_id: userProfile.tenant_id,
            })
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userProfile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (userProfile) {
          setUser({
            id: userProfile.id,
            email: userProfile.email,
            full_name: userProfile.full_name,
            role: userProfile.role,
            tenant_id: userProfile.tenant_id,
          })
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Fetch user profile
      const { data: userProfile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

      if (userProfile) {
        setUser({
          id: userProfile.id,
          email: userProfile.email,
          full_name: userProfile.full_name,
          role: userProfile.role,
          tenant_id: userProfile.tenant_id,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, full_name: string, tenantId?: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .insert({
          id: data.user?.id,
          email,
          full_name,
          tenant_id: tenantId,
          role: "user",
          status: "active",
        })
        .select()
        .single()

      if (profileError) throw profileError

      if (userProfile) {
        setUser({
          id: userProfile.id,
          email: userProfile.email,
          full_name: userProfile.full_name,
          role: userProfile.role,
          tenant_id: userProfile.tenant_id,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
