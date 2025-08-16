"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Calendar
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"

interface UserData {
  id: string
  email: string
  name: string
  role: string
  status: string
  createdAt: string
  lastLogin: string | null
  subscription: {
    id: string
    planId: string
    status: string
    currentPeriodStart: string
    currentPeriodEnd: string
  }
  usage: {
    customers: number
    leads: number
    landingPages: number
    storageUsed: number
    teamMembers: number
  }
}

const CUSTOM_PLANS = {
  starter: { name: 'Starter', price: 1500, landingPages: 1, standardPages: 3 },
  standard: { name: 'Standard', price: 2000, landingPages: 3, standardPages: 8 },
  pro: { name: 'Professional', price: 3000, landingPages: 8, standardPages: -1 }
}

export default function UserDetailsPage() {
  const params = useParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchUser(params.id as string)
    }
  }, [params.id])

  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        const userData = data.users.find((u: UserData) => u.id === userId)
        if (userData) {
          setUser(userData)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading user details...</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">User not found</h2>
              <Link href="/admin/users">
                <Button>Back to Users</Button>
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const selectedPlan = CUSTOM_PLANS[user.subscription.planId as keyof typeof CUSTOM_PLANS]
  const daysUntilExpiry = Math.ceil((new Date(user.subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 
                    user.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                    'bg-orange-100 text-orange-800'
                  }>
                    {user.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedPlan?.name || 'Unknown Plan'}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    ₹{selectedPlan?.price.toLocaleString() || '0'}/month
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Landing Pages:</span>
                    <span>{selectedPlan?.landingPages === -1 ? 'Unlimited' : selectedPlan?.landingPages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Pages:</span>
                    <span>{selectedPlan?.standardPages === -1 ? 'Unlimited' : selectedPlan?.standardPages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={
                      user.subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.subscription.status === 'expired' ? 'bg-red-100 text-red-800' : 
                      'bg-orange-100 text-orange-800'
                    }>
                      {user.subscription.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span>{new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days Remaining:</span>
                    <span className={daysUntilExpiry <= 7 ? 'text-red-600 font-medium' : ''}>
                      {daysUntilExpiry} days
                    </span>
                  </div>
                </div>

                {daysUntilExpiry <= 7 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm text-orange-700">
                      ⚠️ Subscription expires soon! Consider extending or renewing.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Usage Information */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user.usage.customers}</div>
                  <div className="text-sm text-muted-foreground">Customers</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.usage.leads}</div>
                  <div className="text-sm text-muted-foreground">Leads</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{user.usage.landingPages}</div>
                  <div className="text-sm text-muted-foreground">Landing Pages</div>
                  <div className="text-xs text-muted-foreground">
                    / {selectedPlan?.landingPages === -1 ? '∞' : selectedPlan?.landingPages}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{user.usage.teamMembers}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
