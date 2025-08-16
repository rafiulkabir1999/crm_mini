// "use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { CustomerList } from "@/components/modules/customers/customer-list"
import { apiService } from "@/lib/api";

export default function CustomersPage() {
  // const response =  apiService.getCustomers(params{limit:3});

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage all your customers</p>
          </div>
          <CustomerList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 