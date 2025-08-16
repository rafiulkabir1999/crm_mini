"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign, 
  Users, 
  Database,
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { formatPrice, getSubscriptionStatusColor, getUsagePercentage, getUsageColor, formatStorageSize } from "@/lib/subscription-utils"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

// Mock data - replace with real API calls
const mockSubscription = {
  id: "sub_123",
  userId: "user_123",
  planId: "professional",
  status: "active",
  currentPeriodStart: new Date("2024-01-01"),
  currentPeriodEnd: new Date("2024-02-01"),
  cancelAtPeriodEnd: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  plan: SUBSCRIPTION_PLANS.find(p => p.id === "professional")!
}

const mockUsage = {
  userId: "user_123",
  period: "2024-01",
  customers: 127,
  leads: 342,
  landingPages: 3,
  storageUsed: 2048, // 2GB in MB
  teamMembers: 2,
  createdAt: new Date(),
  updatedAt: new Date()
}

const mockInvoices = [
  {
    id: "inv_001",
    userId: "user_123",
    subscriptionId: "sub_123",
    amount: 29.99,
    currency: "USD",
    status: "paid",
    invoiceDate: new Date("2024-01-01"),
    dueDate: new Date("2024-01-01"),
    paidAt: new Date("2024-01-01"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "inv_002",
    userId: "user_123",
    subscriptionId: "sub_123",
    amount: 29.99,
    currency: "USD",
    status: "open",
    invoiceDate: new Date("2024-02-01"),
    dueDate: new Date("2024-02-01"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  }
]

const mockBillingInfo = {
  id: "bill_123",
  userId: "user_123",
  cardLast4: "4242",
  cardBrand: "visa",
  cardExpMonth: 12,
  cardExpYear: 2025,
  billingAddress: {
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US"
  },
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'open':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'past_due':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getCardBrandIcon = (brand: string) => {
    return <CreditCard className="w-4 h-4" />
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Billing & Subscription</h1>
              <p className="text-muted-foreground">Manage your subscription and billing information</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Invoices
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payment">Payment Method</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{mockSubscription.plan.name}</h3>
                      <p className="text-muted-foreground">
                        {formatPrice(mockSubscription.plan.price)}/{mockSubscription.plan.billingCycle}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getSubscriptionStatusColor(mockSubscription.status)}>
                          {mockSubscription.status}
                        </Badge>
                        {mockSubscription.cancelAtPeriodEnd && (
                          <Badge variant="destructive">Cancels at period end</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Next billing date</p>
                      <p className="font-semibold">
                        {mockSubscription.currentPeriodEnd.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                        <p className="text-2xl font-bold">{formatPrice(mockSubscription.plan.price)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Days until renewal</p>
                        <p className="text-2xl font-bold">15</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                        <p className="text-2xl font-bold">•••• 4242</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            #{invoice.id.split('_')[1]}
                          </TableCell>
                          <TableCell>
                            {invoice.invoiceDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatPrice(invoice.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(invoice.status)}
                              <Badge variant={
                                invoice.status === 'paid' ? 'default' : 
                                invoice.status === 'open' ? 'secondary' : 'destructive'
                              }>
                                {invoice.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getCardBrandIcon(mockBillingInfo.cardBrand)}
                      <div>
                        <p className="font-medium">
                          •••• •••• •••• {mockBillingInfo.cardLast4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {mockBillingInfo.cardExpMonth}/{mockBillingInfo.cardExpYear}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Billing Address</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>{mockBillingInfo.billingAddress.line1}</p>
                      {mockBillingInfo.billingAddress.line2 && (
                        <p>{mockBillingInfo.billingAddress.line2}</p>
                      )}
                      <p>
                        {mockBillingInfo.billingAddress.city}, {mockBillingInfo.billingAddress.state} {mockBillingInfo.billingAddress.postalCode}
                      </p>
                      <p>{mockBillingInfo.billingAddress.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Usage Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Usage This Month</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Customers</span>
                        <span>{mockUsage.customers} / {mockSubscription.plan.limits.customers === -1 ? '∞' : mockSubscription.plan.limits.customers}</span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(mockUsage.customers, mockSubscription.plan.limits.customers)} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Leads</span>
                        <span>{mockUsage.leads} / {mockSubscription.plan.limits.leads === -1 ? '∞' : mockSubscription.plan.limits.leads}</span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(mockUsage.leads, mockSubscription.plan.limits.leads)} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Landing Pages</span>
                        <span>{mockUsage.landingPages} / {mockSubscription.plan.limits.landingPages === -1 ? '∞' : mockSubscription.plan.limits.landingPages}</span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(mockUsage.landingPages, mockSubscription.plan.limits.landingPages)} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Storage</span>
                        <span>{formatStorageSize(mockUsage.storageUsed * 1024 * 1024)} / {formatStorageSize(mockSubscription.plan.limits.storage * 1024 * 1024)}</span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(mockUsage.storageUsed, mockSubscription.plan.limits.storage)} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Team Members</span>
                        <span>{mockUsage.teamMembers} / {mockSubscription.plan.limits.teamMembers === -1 ? '∞' : mockSubscription.plan.limits.teamMembers}</span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(mockUsage.teamMembers, mockSubscription.plan.limits.teamMembers)} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Icons */}
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">{mockUsage.customers}</p>
                        <p className="text-sm text-muted-foreground">Customers</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">{mockUsage.leads}</p>
                        <p className="text-sm text-muted-foreground">Leads</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Globe className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-2xl font-bold">{mockUsage.landingPages}</p>
                        <p className="text-sm text-muted-foreground">Landing Pages</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Settings className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                        <p className="text-2xl font-bold">{mockUsage.teamMembers}</p>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
