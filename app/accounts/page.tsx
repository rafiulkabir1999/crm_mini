"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { AccountsModule } from "@/components/modules/accounts/accounts-module"

export default function AccountsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AccountsModule />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 