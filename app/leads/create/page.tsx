"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { ImprovedLeadForm } from "@/components/modules/leads/improved-lead-form"
import { useRouter } from "next/navigation"

export default function CreateLeadPage() {
  const router = useRouter()

  const handleSave = (lead: any) => {
    // Here you would typically save to your database
    console.log("New lead created:", lead)
    // Redirect to leads list
    router.push("/leads/list")
  }

  const handleCancel = () => {
    router.push("/leads")
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ImprovedLeadForm onSave={handleSave} onCancel={handleCancel} />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 