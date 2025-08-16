"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Globe,
  BarChart3,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { FeatureGuard } from "@/components/feature-guard"

// Mock data
const mockLandingPages = [
  {
    id: 1,
    name: "Premium Software Solution",
    slug: "premium-software",
    status: "published",
    views: 1247,
    leads: 89,
    conversion: 7.1,
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-25"
  },
  {
    id: 2,
    name: "Design Consultation Service",
    slug: "design-consultation",
    status: "draft",
    views: 0,
    leads: 0,
    conversion: 0,
    createdAt: "2024-01-20",
    lastUpdated: "2024-01-20"
  },
  {
    id: 3,
    name: "Marketing Campaign Package",
    slug: "marketing-package",
    status: "published",
    views: 892,
    leads: 45,
    conversion: 5.0,
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-22"
  },
  {
    id: 4,
    name: "E-commerce Platform",
    slug: "ecommerce-platform",
    status: "published",
    views: 2156,
    leads: 156,
    conversion: 7.2,
    createdAt: "2024-01-05",
    lastUpdated: "2024-01-24"
  }
]

export default function LandingPagesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPages = mockLandingPages.filter(page =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalViews = mockLandingPages.reduce((sum, page) => sum + page.views, 0)
  const totalLeads = mockLandingPages.reduce((sum, page) => sum + page.leads, 0)
  const avgConversion = mockLandingPages.length > 0 
    ? (totalLeads / totalViews * 100).toFixed(1) 
    : "0.0"

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Landing Pages</h1>
              <p className="text-muted-foreground">Manage your landing pages and track performance</p>
            </div>
            <FeatureGuard feature="canCreateLandingPages">
              <Link href="/landing-pages/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Page
                </Button>
              </Link>
            </FeatureGuard>
          </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{mockLandingPages.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="w-6 h-6 text-green-600" />
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
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
                <p className="text-2xl font-bold">{avgConversion}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Landing Pages</CardTitle>
            <Input
              placeholder="Search pages..."
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
                <TableHead>Page Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      /landing/{page.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={page.status === "published" ? "default" : "secondary"}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{page.views.toLocaleString()}</TableCell>
                  <TableCell>{page.leads}</TableCell>
                  <TableCell>{page.conversion}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {page.createdAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/landing/${page.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/landing-pages/edit/${page.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/landing-pages/analytics/${page.id}`}>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                 </CardContent>
       </Card>
       </div>
     </DashboardLayout>
   </ProtectedRoute>
   )
 }
