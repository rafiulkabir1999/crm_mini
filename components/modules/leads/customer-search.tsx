"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
import type { Customer } from "@/lib/types"

interface CustomerSearchProps {
  onCustomerSelect: (customer: Customer) => void
  onNewCustomer: (phone: string) => void
}

// Mock customer data - in real app this would come from API
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+1234567890",
    email: "john@example.com",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    company: "Tech Corp",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2", 
    name: "Jane Smith",
    phone: "+1987654321",
    email: "jane@example.com",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    company: "Design Studio",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function CustomerSearch({ onCustomerSelect, onNewCustomer }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<Customer[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (searchTerm.length >= 3) {
      searchCustomers(searchTerm)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm])

  const searchCustomers = async (phone: string) => {
    setIsSearching(true)
    setShowSuggestions(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter customers by phone number
    const filtered = mockCustomers.filter(customer => 
      customer.phone.includes(phone) || 
      customer.name.toLowerCase().includes(phone.toLowerCase())
    )
    
    setSuggestions(filtered)
    setIsSearching(false)
  }

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer)
    setSearchTerm(customer.phone)
    setShowSuggestions(false)
  }

  const handleCreateNew = () => {
    onNewCustomer(searchTerm)
    setShowSuggestions(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Search Customer
        </CardTitle>
        <CardDescription>
          Search by phone number or name to find existing customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter phone number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isSearching && (
          <div className="flex items-center justify-center py-4">
            <Loader variant="dots" text="Searching..." />
          </div>
        )}

        {showSuggestions && !isSearching && (
          <div className="space-y-2">
            {suggestions.length > 0 ? (
              <>
                <div className="text-sm font-medium text-muted-foreground">
                  Found {suggestions.length} customer(s):
                </div>
                {suggestions.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        {customer.company && (
                          <div className="text-xs text-muted-foreground">{customer.company}</div>
                        )}
                      </div>
                      <Badge variant="secondary">Existing</Badge>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="text-sm text-muted-foreground">
                  No customer found with "{searchTerm}"
                </div>
                <Button 
                  onClick={handleCreateNew}
                  className="w-full"
                  variant="outline"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Customer
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 