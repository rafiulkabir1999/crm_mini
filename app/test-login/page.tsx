"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function TestLoginPage() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin123")
  const [message, setMessage] = useState("")
  const { login, user, isAuthenticated } = useAuth()

  const handleLogin = async () => {
    setMessage("Logging in...")
    try {
      const success = await login(email, password)
      if (success) {
        setMessage("Login successful!")
      } else {
        setMessage("Login failed!")
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold">Test Login</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Test Login
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        
        {isAuthenticated && user && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium text-green-800">Logged in as:</h3>
            <p className="text-sm text-green-700">Name: {user.name}</p>
            <p className="text-sm text-green-700">Email: {user.email}</p>
            <p className="text-sm text-green-700">Role: {user.role}</p>
            <p className="text-sm text-green-700">Status: {user.status}</p>
            {user.subscription && (
              <div>
                <p className="text-sm text-green-700">Plan: {user.subscription.planId}</p>
                <p className="text-sm text-green-700">Status: {user.subscription.status}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
