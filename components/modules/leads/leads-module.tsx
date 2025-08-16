"use client"

import { useState } from "react"
import type { Lead } from "@/lib/types"
import { mockLeads } from "@/lib/mock-data"
import { LeadForm } from "./lead-form"
import { LeadList } from "./lead-list"
import { useToast } from "@/hooks/use-toast"

export function LeadsModule() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const { toast } = useToast()

  const handleLeadCreated = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev])
    toast({
      title: "Lead created",
      description: `New lead for ${newLead.user.name} has been created.`,
    })
  }

  const handleConvertToSale = (lead: Lead) => {
    // Update lead status to converted
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: "converted" as const, updatedAt: new Date() } : l)),
    )

    toast({
      title: "Lead converted",
      description: `Lead for ${lead.user.name} has been converted to a sale.`,
    })
  }

  const handleEditLead = (lead: Lead) => {
    toast({
      title: "Edit lead",
      description: "Edit functionality would open a dialog here.",
    })
  }

  const handleViewLead = (lead: Lead) => {
    toast({
      title: "View lead",
      description: "Lead details would open in a modal here.",
    })
  }

  return (
    <div className="space-y-6">
      <LeadForm onLeadCreated={handleLeadCreated} />
      <LeadList
        leads={leads}
        onConvertToSale={handleConvertToSale}
        onEditLead={handleEditLead}
        onViewLead={handleViewLead}
      />
    </div>
  )
}
