export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  company: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Lead {
  id: string
  customerId: string
  title: string
  description: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  value: number
  source: string
  followUpDate: Date | null
  createdAt: Date
  updatedAt: Date
  userId: string
  customer: Customer
}

export interface Sale {
  id: string
  customerId: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  date: Date
  description: string
  createdAt: Date
  updatedAt: Date
  userId: string
  customer: Customer
}

export interface Account {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

// SaaS Subscription Types
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  limits: {
    customers: number
    leads: number
    landingPages: number
    storage: number // in MB
    teamMembers: number
  }
  isPopular?: boolean
  isActive: boolean
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
  plan: SubscriptionPlan
}

export interface BillingInfo {
  id: string
  userId: string
  cardLast4: string
  cardBrand: string
  cardExpMonth: number
  cardExpYear: number
  billingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  userId: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  invoiceDate: Date
  dueDate: Date
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UsageMetrics {
  userId: string
  period: string // YYYY-MM
  customers: number
  leads: number
  landingPages: number
  storageUsed: number // in MB
  teamMembers: number
  createdAt: Date
  updatedAt: Date
}

// Extended User type with subscription info
export interface UserWithSubscription extends User {
  subscription?: UserSubscription
  billingInfo?: BillingInfo
  usage?: UsageMetrics
}

// Feature flags based on subscription
export interface FeatureAccess {
  canCreateCustomers: boolean
  canCreateLeads: boolean
  canCreateLandingPages: boolean
  canInviteTeamMembers: boolean
  canExportData: boolean
  canAccessAnalytics: boolean
  canCustomizeTheme: boolean
  maxCustomers: number
  maxLeads: number
  maxLandingPages: number
  maxStorage: number
  maxTeamMembers: number
}
