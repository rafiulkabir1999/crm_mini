"use client"

import { useState } from "react"
import type { Sale } from "@/lib/types"
import { mockSales } from "@/lib/mock-data"
import { SalesTable } from "./sales-table"
import { SaleDetailModal } from "./sale-detail-modal"
import { useToast } from "@/hooks/use-toast"

export function SalesModule() {
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { toast } = useToast()

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale)
    setShowDetailModal(true)
  }

  const handleUpdateStatus = (saleId: string, status: Sale["status"]) => {
    setSales((prev) => prev.map((sale) => (sale.id === saleId ? { ...sale, status, updatedAt: new Date() } : sale)))

    toast({
      title: "Sale updated",
      description: `Sale status has been updated to ${status}.`,
    })
  }

  return (
    <div className="space-y-6">
      <SalesTable sales={sales} onViewSale={handleViewSale} onUpdateStatus={handleUpdateStatus} />

      <SaleDetailModal
        sale={selectedSale}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}
