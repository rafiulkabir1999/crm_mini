"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  User, 
  Phone, 
  Package, 
  TrendingUp, 
  Calendar,
  Building,
  MapPin,
  Save,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
import { CustomerSearch } from "./customer-search"
import { CustomerForm } from "./customer-form"
import type { Customer } from "@/lib/types"

const leadSchema = z.object({
  interestedProduct: z.string().min(1, "Product is required"),
  quantity: z.string().min(1, "Quantity is required"),
  leadSource: z.string().min(1, "Lead source is required"),
  status: z.string().min(1, "Status is required"),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

interface ImprovedLeadFormProps {
  onSave: (lead: any) => void
  onCancel: () => void
}

export function ImprovedLeadForm({ onSave, onCancel }: ImprovedLeadFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      interestedProduct: "",
      quantity: "",
      leadSource: "",
      status: "new",
      followUpDate: "",
      notes: "",
    },
  })

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerForm(false)
  }

  const handleNewCustomer = (phone: string) => {
    setShowCustomerForm(true)
  }

  const handleCustomerSave = (customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">) => {
    // Create a new customer object with generated ID
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSelectedCustomer(newCustomer)
    setShowCustomerForm(false)
  }

  const handleCustomerCancel = () => {
    setShowCustomerForm(false)
  }

  const onSubmit = async (data: LeadFormData) => {
    if (!selectedCustomer) {
      alert("Please select or create a customer first")
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lead = {
      id: Date.now().toString(),
      user: selectedCustomer,
      interestedProduct: data.interestedProduct,
      quantity: data.quantity,
      leadSource: data.leadSource,
      status: data.status,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
      notes: data.notes,
      createdAt: new Date(),
    }
    
    onSave(lead)
    setIsSubmitting(false)
  }

  if (showCustomerForm) {
    return (
      <div className="flex justify-center">
        <CustomerForm
          onSave={handleCustomerSave}
          onCancel={handleCustomerCancel}
        />
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Create New Lead
          </CardTitle>
          <CardDescription>
            Create a new lead by selecting or creating a customer first
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Selection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Customer Information</h3>
              {selectedCustomer && (
                <Badge variant="secondary">Customer Selected</Badge>
              )}
            </div>
            
            {!selectedCustomer ? (
              <CustomerSearch
                onCustomerSelect={handleCustomerSelect}
                onNewCustomer={handleNewCustomer}
              />
            ) : (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{selectedCustomer.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedCustomer.phone}</div>
                    {selectedCustomer.company && (
                      <div className="text-sm text-muted-foreground">{selectedCustomer.company}</div>
                    )}
                    {selectedCustomer.address && (
                      <div className="text-sm text-muted-foreground">
                        {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Change Customer
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Lead Information Form */}
          {selectedCustomer && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestedProduct">Interested Product *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="interestedProduct"
                      {...register("interestedProduct")}
                      placeholder="Enter product name"
                      className="pl-10"
                    />
                  </div>
                  {errors.interestedProduct && (
                    <p className="text-sm text-red-500">{errors.interestedProduct.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    {...register("quantity")}
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leadSource">Lead Source *</Label>
                  <Select onValueChange={(value) => setValue("leadSource", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="cold-call">Cold Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.leadSource && (
                    <p className="text-sm text-red-500">{errors.leadSource.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value) => setValue("status", value)} defaultValue="new">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="followUpDate"
                    type="date"
                    {...register("followUpDate")}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Additional notes about the lead"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader variant="spinner" size="sm" />
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Lead
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 