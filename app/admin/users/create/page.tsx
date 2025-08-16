"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  CreditCard,
  Globe,
  Users,
  Database,
  Settings
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { toast } from "sonner"

// Custom subscription plans based on your requirements
const CUSTOM_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1500,
    features: [
      '1 Landing Page',
      '3 Standard Pages',
      'Basic Analytics',
      'Email Support',
      '1GB Storage'
    ],
    limits: {
      landingPages: 1,
      standardPages: 3,
      storage: 1024,
      teamMembers: 1
    }
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 2000,
    features: [
      '3 Landing Pages',
      '8 Standard Pages',
      'Advanced Analytics',
      'Priority Support',
      '5GB Storage',
      'Team Collaboration'
    ],
    limits: {
      landingPages: 3,
      standardPages: 8,
      storage: 5120,
      teamMembers: 3
    }
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 3000,
    features: [
      '8 Landing Pages',
      'Unlimited Standard Pages',
      'Advanced Analytics & Reporting',
      '24/7 Priority Support',
      '20GB Storage',
      'Unlimited Team Members',
      'Custom Branding',
      'API Access'
    ],
    limits: {
      landingPages: 8,
      standardPages: -1, // Unlimited
      storage: 20480,
      teamMembers: -1 // Unlimited
    }
  }
]

interface CreateUserForm {
  name: string
  email: string
  role: 'user' | 'admin'
  subscriptionPlan: string
  status: 'active' | 'pending' | 'suspended'
  notes: string
  sendWelcomeEmail: boolean
  autoActivate: boolean
}

export default function CreateUserPage() {
  const [formData, setFormData] = useState<CreateUserForm>({
    name: '',
    email: '',
    role: 'user',
    subscriptionPlan: 'starter',
    status: 'pending',
    notes: '',
    sendWelcomeEmail: true,
    autoActivate: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const selectedPlan = CUSTOM_PLANS.find(plan => plan.id === formData.subscriptionPlan)

  const handleInputChange = (field: keyof CreateUserForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subscriptionPlan: formData.subscriptionPlan,
          autoActivate: formData.autoActivate
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('User created successfully!', {
          description: `${result.data.name} has been added to the system.`
        })
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          role: 'user',
          subscriptionPlan: 'starter',
          status: 'pending',
          notes: '',
          sendWelcomeEmail: true,
          autoActivate: false
        })
        
        // Redirect to users list after a short delay
        setTimeout(() => {
          window.location.href = '/admin/users'
        }, 1500)
      } else {
        toast.error('Failed to create user', {
          description: result.message || 'An error occurred while creating the user.'
        })
        setMessage(`Error: ${result.message}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Error creating user', {
        description: 'Network error occurred. Please try again.'
      })
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create user'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Users
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Create New User</h1>
                <p className="text-muted-foreground">Add a new user with subscription package</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>

                    {/* Role and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">User Role</Label>
                        <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Account Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Subscription Plan */}
                    <div>
                      <Label htmlFor="subscriptionPlan">Subscription Plan *</Label>
                      <Select value={formData.subscriptionPlan} onValueChange={(value) => handleInputChange('subscriptionPlan', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CUSTOM_PLANS.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - ₹{plan.price.toLocaleString()}/month
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sendWelcomeEmail">Send Welcome Email</Label>
                          <p className="text-sm text-muted-foreground">Send welcome email with login credentials</p>
                        </div>
                        <Switch
                          id="sendWelcomeEmail"
                          checked={formData.sendWelcomeEmail}
                          onCheckedChange={(checked) => handleInputChange('sendWelcomeEmail', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="autoActivate">Auto-Activate Account</Label>
                          <p className="text-sm text-muted-foreground">Automatically activate the user account</p>
                        </div>
                        <Switch
                          id="autoActivate"
                          checked={formData.autoActivate}
                          onCheckedChange={(checked) => handleInputChange('autoActivate', checked)}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Add any additional notes about this user..."
                        rows={3}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Creating User...' : 'Create User'}
                      </Button>
                      <Link href="/admin/users">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </Link>
                    </div>

                    {/* Message */}
                    {message && (
                      <div className={`p-3 rounded-md ${
                        message.includes('Error') 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {message}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Plan Details Sidebar */}
            <div className="space-y-6">
              {/* Selected Plan Details */}
              {selectedPlan && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      {selectedPlan.name} Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        ₹{selectedPlan.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">
                          {selectedPlan.limits.landingPages === -1 
                            ? 'Unlimited' 
                            : selectedPlan.limits.landingPages} Landing Pages
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          {selectedPlan.limits.standardPages === -1 
                            ? 'Unlimited' 
                            : selectedPlan.limits.standardPages} Standard Pages
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">
                          {selectedPlan.limits.storage === -1 
                            ? 'Unlimited' 
                            : `${(selectedPlan.limits.storage / 1024).toFixed(0)} GB`} Storage
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">
                          {selectedPlan.limits.teamMembers === -1 
                            ? 'Unlimited' 
                            : selectedPlan.limits.teamMembers} Team Members
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Features:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Plans Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>All Plans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {CUSTOM_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.subscriptionPlan === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleInputChange('subscriptionPlan', plan.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {plan.limits.landingPages === -1 
                              ? 'Unlimited' 
                              : plan.limits.landingPages} Landing Pages
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹{plan.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">/month</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
