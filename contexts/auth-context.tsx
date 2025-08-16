"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { apiService, User } from "@/lib/api"



interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        
        // Verify token with API
        apiService.verifyToken(token).then(isValid => {
          if (isValid) {
            setUser(parsedUser)
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("authToken")
            localStorage.removeItem("user")
          }
          setIsLoading(false)
        }).catch(() => {
          // API error, clear storage
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          setIsLoading(false)
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { email, password })
      const response = await apiService.login({ email, password })
      console.log('Login response:', response)
      
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      setUser(null)
    }
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 