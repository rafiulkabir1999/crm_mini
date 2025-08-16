"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { SalesModule } from "@/components/modules/sales/sales-module"

export default function SalesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SalesModule />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 