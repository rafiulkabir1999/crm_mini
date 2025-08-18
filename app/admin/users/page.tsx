"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Search,
  MoreHorizontal,
  RefreshCw,
  Settings,
  UserPlus,
  Eye,
  Loader2
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { userService, User } from "@/lib/services/user-service"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    expired: 0
  })

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const [usersData] = await Promise.all([
        userService.getUsers(),
        // userService.getUserStats()
      ])
      console.log(usersData, "usersData") 
      // console.log(statsData, "statsData56")
      setUsers(usersData)
      // setStats(statsData)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users', {
        description: 'Please refresh the page to try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadUsers()
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Simple function to calculate days until renewal
  const getDaysUntilRenewal = (subscription: any) => {
    const now = new Date()
    const endDate = new Date(subscription?.currentPeriodEnd)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="w-4 h-4 text-green-500" />
      case 'suspended':
        return <UserX className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getSubscriptionIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'past_due':
        return <Clock className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleActivateUser = async (userId: string) => {
    try {
      await userService.updateUserStatus(userId, 'active')
      toast.success('User activated successfully!')
      loadUsers() // Refresh the list
    } catch (error) {
      toast.error('Failed to activate user', {
        description: 'An error occurred while activating the user.'
      })
    }
  }

  const handleSuspendUser = async (userId: string) => {
    try {
      await userService.updateUserStatus(userId, 'suspended')
      toast.success('User suspended successfully!')
      loadUsers() // Refresh the list
    } catch (error) {
      toast.error('Failed to suspend user', {
        description: 'An error occurred while suspending the user.'
      })
    }
  }

  const handleExtendSubscription = async (userId: string) => {
    try {
      // For now, just show a success message since subscription updates need special handling
      toast.success('Subscription extension requested!', {
        description: 'This feature will be implemented in the next update.'
      })
      // TODO: Implement actual subscription extension logic
    } catch (error) {
      toast.error('Failed to extend subscription', {
        description: 'An error occurred while extending the subscription.'
      })
    }
  }



  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage user accounts and subscription status</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/users/create">
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </Link>
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-xl font-bold">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Suspended</p>
                    <p className="text-xl font-bold">{stats.suspended}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expired</p>
                    <p className="text-xl font-bold">{stats.expired}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                </div>
              ) : (
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : 
                                           user.status === "suspended" ? "bg-red-100 text-red-800" : 
                                           "bg-orange-100 text-orange-800"}>
                            {user.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSubscriptionIcon(user?.subscription?.status)}
                          <Badge className={
                            user.subscription?.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.subscription?.status === 'expired' ? 'bg-red-100 text-red-800' :
                            user.subscription?.status === 'past_due' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {user.subscription?.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {user.subscription?.planId === 'starter' ? 'Starter' :
                             user.subscription?.planId === 'standard' ? 'Standard' :
                             user.subscription?.planId === 'pro' ? 'Professional' : user.subscription?.planId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ₹{user.subscription?.planId === 'starter' ? '1,500' :
                               user.subscription?.planId === 'standard' ? '2,000' :
                               user.subscription?.planId === 'pro' ? '3,000' : '0'}/month
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(user.subscription?.currentPeriodEnd).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getDaysUntilRenewal(user?.subscription)} days left
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{user.usage.customers} customers</p>
                          <p>{user.usage.leads} leads</p>
                          <p>{user.usage.landingPages} / {
                            user.subscription?.planId === 'starter' ? '1' :
                            user.subscription?.planId === 'standard' ? '3' :
                            user.subscription?.planId === 'pro' ? '8' : '0'
                          } landing pages</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.status === "suspended" ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleActivateUser(user.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Suspend
                            </Button>
                          )}
                          {user.subscription?.status === "expired" && (
                            <Button 
                              size="sm"
                              onClick={() => handleExtendSubscription(user.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Extend
                            </Button>
                          )}
                          <Link href={`/admin/users/${user.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
