import type { User, Lead, Sale, Expense, AccountsSummary } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+1234567890",
    email: "john@example.com",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+1987654321",
    email: "jane@example.com",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    phone: "+1122334455",
    createdAt: new Date("2024-02-01"),
  },
]

export const mockLeads: Lead[] = [
  {
    id: "1",
    userId: "1",
    user: mockUsers[0],
    interestedProduct: "Premium Widget",
    quantity: 5,
    leadSource: "Facebook Ads",
    notes: "Very interested, wants bulk discount",
    status: "interested",
    followUpDate: new Date("2024-02-15"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "2",
    userId: "2",
    user: mockUsers[1],
    interestedProduct: "Basic Widget",
    quantity: 2,
    leadSource: "Website",
    notes: "Price sensitive customer",
    status: "contacted",
    followUpDate: new Date("2024-02-10"),
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "3",
    userId: "3",
    user: mockUsers[2],
    interestedProduct: "Premium Widget",
    quantity: 10,
    leadSource: "Referral",
    notes: "Referred by existing customer",
    status: "converted",
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-02-08"),
  },
]

export const mockSales: Sale[] = [
  {
    id: "1",
    leadId: "3",
    lead: mockLeads[2],
    product: "Premium Widget",
    quantity: 10,
    price: 99.99,
    totalAmount: 999.9,
    status: "completed",
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-12"),
  },
]

export const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Facebook Ads Campaign",
    amount: 250.0,
    category: "ads",
    date: new Date("2024-02-01"),
  },
  {
    id: "2",
    description: "Packaging Materials",
    amount: 150.0,
    category: "packaging",
    date: new Date("2024-02-05"),
  },
  {
    id: "3",
    description: "Delivery Costs",
    amount: 75.0,
    category: "delivery",
    date: new Date("2024-02-10"),
  },
]

export const mockAccountsSummary: AccountsSummary = {
  totalIncome: 999.9,
  totalExpenses: 475.0,
  netProfit: 524.9,
  monthlyData: [
    { month: "Jan", income: 0, expenses: 0 },
    { month: "Feb", income: 999.9, expenses: 475.0 },
    { month: "Mar", income: 0, expenses: 0 },
    { month: "Apr", income: 0, expenses: 0 },
    { month: "May", income: 0, expenses: 0 },
    { month: "Jun", income: 0, expenses: 0 },
  ],
}
