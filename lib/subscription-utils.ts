import { UserSubscription, UsageMetrics, FeatureAccess, SubscriptionPlan } from './types'
import { getPlanById } from './subscription-plans'

export function getUserFeatureAccess(subscription?: UserSubscription, usage?: UsageMetrics): FeatureAccess {
  if (!subscription || subscription.status !== 'active') {
    // Free tier access
    return {
      canCreateCustomers: true,
      canCreateLeads: true,
      canCreateLandingPages: false,
      canInviteTeamMembers: false,
      canExportData: false,
      canAccessAnalytics: false,
      canCustomizeTheme: false,
      maxCustomers: 10,
      maxLeads: 25,
      maxLandingPages: 0,
      maxStorage: 100, // 100MB
      maxTeamMembers: 1
    }
  }

  const plan = subscription.plan
  const limits = plan.limits

  return {
    canCreateCustomers: true,
    canCreateLeads: true,
    canCreateLandingPages: limits.landingPages > 0,
    canInviteTeamMembers: limits.teamMembers > 1,
    canExportData: plan.price >= 29.99, // Professional and above
    canAccessAnalytics: plan.price >= 29.99, // Professional and above
    canCustomizeTheme: plan.price >= 29.99, // Professional and above
    maxCustomers: limits.customers === -1 ? Infinity : limits.customers,
    maxLeads: limits.leads === -1 ? Infinity : limits.leads,
    maxLandingPages: limits.landingPages === -1 ? Infinity : limits.landingPages,
    maxStorage: limits.storage === -1 ? Infinity : limits.storage,
    maxTeamMembers: limits.teamMembers === -1 ? Infinity : limits.teamMembers
  }
}

export function checkUsageLimit(
  feature: 'customers' | 'leads' | 'landingPages' | 'storage' | 'teamMembers',
  currentUsage: number,
  subscription?: UserSubscription
): { allowed: boolean; limit: number; remaining: number } {
  if (!subscription || subscription.status !== 'active') {
    // Free tier limits
    const freeLimits = {
      customers: 10,
      leads: 25,
      landingPages: 0,
      storage: 100,
      teamMembers: 1
    }
    const limit = freeLimits[feature]
    return {
      allowed: currentUsage < limit,
      limit,
      remaining: Math.max(0, limit - currentUsage)
    }
  }

  const plan = subscription.plan
  const limit = plan.limits[feature]

  if (limit === -1) {
    // Unlimited
    return {
      allowed: true,
      limit: Infinity,
      remaining: Infinity
    }
  }

  return {
    allowed: currentUsage < limit,
    limit,
    remaining: Math.max(0, limit - currentUsage)
  }
}

export function isSubscriptionActive(subscription?: UserSubscription): boolean {
  if (!subscription) return false
  return subscription.status === 'active' && new Date() < subscription.currentPeriodEnd
}

export function getDaysUntilRenewal(subscription?: UserSubscription): number {
  if (!subscription || !isSubscriptionActive(subscription)) return 0
  
  const now = new Date()
  const renewalDate = new Date(subscription.currentPeriodEnd)
  const diffTime = renewalDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price)
}

export function calculateProratedAmount(
  currentPlan: SubscriptionPlan,
  newPlan: SubscriptionPlan,
  daysRemaining: number,
  totalDaysInPeriod: number
): number {
  const currentDailyRate = currentPlan.price / totalDaysInPeriod
  const newDailyRate = newPlan.price / totalDaysInPeriod
  const credit = currentDailyRate * daysRemaining
  const charge = newDailyRate * daysRemaining
  
  return Math.max(0, charge - credit)
}

export function getSubscriptionStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100'
    case 'cancelled':
      return 'text-gray-600 bg-gray-100'
    case 'expired':
      return 'text-red-600 bg-red-100'
    case 'past_due':
      return 'text-orange-600 bg-orange-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getUsagePercentage(current: number, limit: number): number {
  if (limit === -1 || limit === Infinity) return 0
  if (limit === 0) return 100
  return Math.min(100, (current / limit) * 100)
}

export function getUsageColor(percentage: number): string {
  if (percentage >= 90) return 'text-red-600'
  if (percentage >= 75) return 'text-orange-600'
  if (percentage >= 50) return 'text-yellow-600'
  return 'text-green-600'
}

export function formatStorageSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  const gb = mb / 1024
  
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`
  }
  return `${mb.toFixed(0)} MB`
}

export function getPlanUpgradeRecommendation(usage: UsageMetrics, subscription?: UserSubscription): string | null {
  if (!subscription) return 'professional'
  
  const plan = subscription.plan
  const limits = plan.limits
  
  // Check if user is approaching limits
  const customerUsage = getUsagePercentage(usage.customers, limits.customers)
  const leadUsage = getUsagePercentage(usage.leads, limits.leads)
  const landingPageUsage = getUsagePercentage(usage.landingPages, limits.landingPages)
  const storageUsage = getUsagePercentage(usage.storageUsed, limits.storage)
  
  if (customerUsage > 80 || leadUsage > 80 || landingPageUsage > 80 || storageUsage > 80) {
    if (plan.id === 'starter') return 'professional'
    if (plan.id === 'professional') return 'business'
    if (plan.id === 'business') return 'enterprise'
  }
  
  return null
}
