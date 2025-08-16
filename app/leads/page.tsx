"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, List, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Choose how you want to manage your leads</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Create New Lead</CardTitle>
                  <CardDescription>Add a new lead to your system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and add new leads with detailed information including contact details, 
                company information, and lead status.
              </p>
              <Link href="/leads/create">
                <Button className="w-full group-hover:bg-blue-600 transition-colors">
                  Create Lead
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <List className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>View All Leads</CardTitle>
                  <CardDescription>Browse and manage existing leads</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View, search, filter, and manage all your leads in a comprehensive list view 
                with advanced sorting and filtering options.
              </p>
              <Link href="/leads/list">
                <Button variant="outline" className="w-full group-hover:bg-green-50 transition-colors">
                  View Leads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of your leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-muted-foreground">New This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">12.5%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
} 