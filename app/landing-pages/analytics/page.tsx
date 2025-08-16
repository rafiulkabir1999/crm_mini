"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Eye, 
  Users, 
  TrendingUp, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Download,
  Filter
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"

// Mock data
const mockLeads = [
  {
    id: 1,
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john@example.com",
    address: "123 Main St, New York, NY",
    quantity: 2,
    landingPage: "Premium Software Solution",
    createdAt: "2024-01-25 14:30",
    status: "new"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    email: "sarah@example.com",
    address: "456 Oak Ave, Los Angeles, CA",
    quantity: 1,
    landingPage: "Marketing Campaign Package",
    createdAt: "2024-01-25 12:15",
    status: "contacted"
  },
  {
    id: 3,
    name: "Mike Wilson",
    phone: "+1 (555) 456-7890",
    email: "mike@example.com",
    address: "789 Pine Rd, Chicago, IL",
    quantity: 3,
    landingPage: "Premium Software Solution",
    createdAt: "2024-01-25 10:45",
    status: "converted"
  },
  {
    id: 4,
    name: "Emily Davis",
    phone: "+1 (555) 789-0123",
    email: "emily@example.com",
    address: "321 Elm St, Miami, FL",
    quantity: 1,
    landingPage: "E-commerce Platform",
    createdAt: "2024-01-24 16:20",
    status: "new"
  }
]

const mockPageStats = [
  {
    name: "Premium Software Solution",
    views: 1247,
    leads: 89,
    conversion: 7.1,
    revenue: 17800
  },
  {
    name: "Marketing Campaign Package",
    views: 892,
    leads: 45,
    conversion: 5.0,
    revenue: 9000
  },
  {
    name: "E-commerce Platform",
    views: 2156,
    leads: 156,
    conversion: 7.2,
    revenue: 31200
  }
]

export default function LandingPageAnalytics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.landingPage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalViews = mockPageStats.reduce((sum, page) => sum + page.views, 0)
  const totalLeads = mockPageStats.reduce((sum, page) => sum + page.leads, 0)
  const totalRevenue = mockPageStats.reduce((sum, page) => sum + page.revenue, 0)
  const avgConversion = mockPageStats.length > 0 
    ? (totalLeads / totalViews * 100).toFixed(1) 
    : "0.0"

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/landing-pages">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pages
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Landing Page Analytics</h1>
                <p className="text-muted-foreground">Track performance and analyze lead generation</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{avgConversion}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-600">{lead.landingPage}</p>
                      </div>
                      <Badge variant="secondary">{lead.quantity} items</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Page Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Page Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPageStats.map((page) => (
                    <div key={page.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{page.name}</p>
                        <p className="text-sm text-gray-600">{page.views} views</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{page.leads} leads</p>
                        <p className="text-sm text-gray-600">{page.conversion}% conversion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Leads</CardTitle>
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Landing Page</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {lead.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{lead.quantity}</Badge>
                      </TableCell>
                      <TableCell>{lead.landingPage}</TableCell>
                      <TableCell>
                        <Badge variant={
                          lead.status === "converted" ? "default" : 
                          lead.status === "contacted" ? "secondary" : "outline"
                        }>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {lead.createdAt}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Name</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPageStats.map((page) => (
                    <TableRow key={page.name}>
                      <TableCell className="font-medium">{page.name}</TableCell>
                      <TableCell>{page.views.toLocaleString()}</TableCell>
                      <TableCell>{page.leads}</TableCell>
                      <TableCell>{page.conversion}%</TableCell>
                      <TableCell>${page.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
                 </TabsContent>
       </Tabs>
       </div>
     </DashboardLayout>
   </ProtectedRoute>
   )
 }
