"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Sale } from "@/lib/types"

interface SaleDetailModalProps {
  sale: Sale | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (saleId: string, status: Sale["status"]) => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function SaleDetailModal({ sale, open, onOpenChange, onUpdateStatus }: SaleDetailModalProps) {
  if (!sale) return null

  const getNextStatus = (currentStatus: Sale["status"]): Sale["status"] | null => {
    switch (currentStatus) {
      case "pending":
        return "shipped"
      case "shipped":
        return "completed"
      default:
        return null
    }
  }

  const nextStatus = getNextStatus(sale.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sale Details</DialogTitle>
          <DialogDescription>Sale ID: {sale.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Customer</h4>
              <p className="font-medium">{sale.lead.user.name}</p>
              <p className="text-sm text-muted-foreground">{sale.lead.user.phone}</p>
              {sale.lead.user.email && <p className="text-sm text-muted-foreground">{sale.lead.user.email}</p>}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Status</h4>
              <Badge className={statusColors[sale.status]}>{sale.status}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Product</h4>
              <p>{sale.product}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Quantity</h4>
              <p>{sale.quantity}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Unit Price</h4>
              <p>${sale.price.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Total Amount</h4>
              <p className="font-semibold text-lg">${sale.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Created</h4>
              <p>{format(sale.createdAt, "PPP")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Last Updated</h4>
              <p>{format(sale.updatedAt, "PPP")}</p>
            </div>
          </div>

          {sale.lead.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Original Lead Notes</h4>
                <p className="text-sm">{sale.lead.notes}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            {nextStatus && (
              <Button
                onClick={() => {
                  onUpdateStatus(sale.id, nextStatus)
                  onOpenChange(false)
                }}
              >
                Mark as {nextStatus}
              </Button>
            )}
            {(sale.status === "pending" || sale.status === "shipped") && (
              <Button
                variant="destructive"
                onClick={() => {
                  onUpdateStatus(sale.id, "cancelled")
                  onOpenChange(false)
                }}
              >
                Cancel Sale
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
