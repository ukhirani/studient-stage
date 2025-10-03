import React, { createContext, useContext, useState, useEffect } from "react"
import { dummyDataStore, DummyUser } from "@/lib/dummyData"

interface AuthContextType {
  user: DummyUser | null
  profile: any
  session: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (data: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const DummyAuthContext = createContext<AuthContextType | undefined>(undefined)

export function DummyAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DummyUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored session on mount
    const storedUserId = localStorage.getItem("dummyAuthUserId")
    if (storedUserId) {
      const storedUser = dummyDataStore.users.find(u => u.id === storedUserId)
      if (storedUser) {
        setUser(storedUser)
        dummyDataStore.currentUser = storedUser
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const user = dummyDataStore.login(email, password)
    if (user) {
      setUser(user)
      localStorage.setItem("dummyAuthUserId", user.id)
      return { error: null }
    }
    return { error: { message: "Invalid email or password" } }
  }

  const signUp = async (data: { email: string; password: string; fullName: string; role: string; companyName?: string; industry?: string }) => {
    // For demo purposes, just return success without actually creating user
    return { error: null }
  }

  const signOut = async () => {
    dummyDataStore.logout()
    setUser(null)
    localStorage.removeItem("dummyAuthUserId")
  }

  const value = {
    user,
    profile: user?.profile || null,
    session: user ? { user: { id: user.id, email: user.email } } : null,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <DummyAuthContext.Provider value={value}>{children}</DummyAuthContext.Provider>
}

export function useDummyAuth() {
  const context = useContext(DummyAuthContext)
  if (context === undefined) {
    throw new Error("useDummyAuth must be used within a DummyAuthProvider")
  }
  return context
}
