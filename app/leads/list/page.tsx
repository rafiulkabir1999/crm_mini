"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { LeadList } from "@/components/modules/leads/lead-list"
import type { Lead } from "@/lib/types"

// Mock leads data
const mockLeads: Lead[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
    },
    interestedProduct: "Enterprise Software",
    quantity: "5 licenses",
    leadSource: "website",
    status: "new",
    followUpDate: new Date("2024-02-15"),
    notes: "Interested in enterprise solution",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      phone: "+1987654321",
      email: "jane@example.com",
    },
    interestedProduct: "Design Tools",
    quantity: "10 licenses",
    leadSource: "referral",
    status: "contacted",
    followUpDate: new Date("2024-02-20"),
    notes: "Looking for design software",
    createdAt: new Date("2024-01-10"),
  },
]

export default function LeadListPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)

  const handleConvertToSale = (lead: Lead) => {
    console.log("Convert to sale:", lead)
    // Implement conversion logic
  }

  const handleEditLead = (lead: Lead) => {
    console.log("Edit lead:", lead)
    // Implement edit logic
  }

  const handleViewLead = (lead: Lead) => {
    console.log("View lead:", lead)
    // Implement view logic
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Manage and view all your leads</p>
        </div>
        <LeadList
          leads={leads}
          onConvertToSale={handleConvertToSale}
          onEditLead={handleEditLead}
          onViewLead={handleViewLead}
        />
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
} 