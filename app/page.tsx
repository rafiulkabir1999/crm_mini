"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/modules/dashboard/dashboard-overview"
import { ProtectedRoute } from "@/components/protected-route"

export default function CRMDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
