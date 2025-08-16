import { UserSubscription, User } from './types'

export interface SubscriptionCheckResult {
  isActive: boolean
  isExpired: boolean
  daysUntilExpiry: number
  shouldSuspend: boolean
  shouldNotify: boolean
  status: 'active' | 'expired' | 'past_due' | 'cancelled'
}

export function checkSubscriptionStatus(subscription?: UserSubscription): SubscriptionCheckResult {
  if (!subscription) {
    return {
      isActive: false,
      isExpired: true,
      daysUntilExpiry: 0,
      shouldSuspend: true,
      shouldNotify: false,
      status: 'expired'
    }
  }

  const now = new Date()
  const expiryDate = new Date(subscription.currentPeriodEnd)
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const isExpired = daysUntilExpiry <= 0
  const isActive = subscription.status === 'active' && !isExpired
  const shouldSuspend = isExpired && subscription.status !== 'cancelled'
  const shouldNotify = daysUntilExpiry <= 7 && daysUntilExpiry > 0 // Notify 7 days before expiry

  let status: SubscriptionCheckResult['status'] = subscription.status as any
  if (isExpired && subscription.status === 'active') {
    status = 'expired'
  }

  return {
    isActive,
    isExpired,
    daysUntilExpiry: Math.max(0, daysUntilExpiry),
    shouldSuspend,
    shouldNotify,
    status
  }
}

export function shouldAutoSuspendUser(user: User & { subscription?: UserSubscription }): boolean {
  const checkResult = checkSubscriptionStatus(user.subscription)
  return checkResult.shouldSuspend
}

export function getUsersNeedingAction(users: (User & { subscription?: UserSubscription })[]): {
  toSuspend: (User & { subscription?: UserSubscription })[]
  toNotify: (User & { subscription?: UserSubscription })[]
  expired: (User & { subscription?: UserSubscription })[]
} {
  const toSuspend: (User & { subscription?: UserSubscription })[] = []
  const toNotify: (User & { subscription?: UserSubscription })[] = []
  const expired: (User & { subscription?: UserSubscription })[] = []

  users.forEach(user => {
    const checkResult = checkSubscriptionStatus(user.subscription)
    
    if (checkResult.shouldSuspend && user.status === 'active') {
      toSuspend.push(user)
    }
    
    if (checkResult.shouldNotify) {
      toNotify.push(user)
    }
    
    if (checkResult.isExpired) {
      expired.push(user)
    }
  })

  return { toSuspend, toNotify, expired }
}

export function generateExpiryNotification(user: User & { subscription?: UserSubscription }): {
  subject: string
  message: string
  urgency: 'low' | 'medium' | 'high'
} {
  const checkResult = checkSubscriptionStatus(user.subscription)
  
  if (checkResult.daysUntilExpiry === 0) {
    return {
      subject: 'Your subscription has expired',
      message: `Dear ${user.name}, your subscription has expired. Please renew to continue accessing our services.`,
      urgency: 'high'
    }
  }
  
  if (checkResult.daysUntilExpiry <= 3) {
    return {
      subject: 'Your subscription expires soon',
      message: `Dear ${user.name}, your subscription expires in ${checkResult.daysUntilExpiry} days. Please renew to avoid service interruption.`,
      urgency: 'high'
    }
  }
  
  return {
    subject: 'Subscription renewal reminder',
    message: `Dear ${user.name}, your subscription will expire in ${checkResult.daysUntilExpiry} days. Consider renewing to maintain uninterrupted access.`,
    urgency: 'medium'
  }
}

export function calculateGracePeriod(subscription: UserSubscription): number {
  // Default grace period is 7 days
  const defaultGracePeriod = 7
  
  // You can customize grace periods based on plan or other factors
  switch (subscription.planId) {
    case 'enterprise':
      return 14 // Longer grace period for enterprise
    case 'business':
      return 10 // Medium grace period for business
    default:
      return defaultGracePeriod
  }
}

export function isInGracePeriod(subscription: UserSubscription): boolean {
  const gracePeriod = calculateGracePeriod(subscription)
  const checkResult = checkSubscriptionStatus(subscription)
  
  return checkResult.isExpired && checkResult.daysUntilExpiry >= -gracePeriod
}

export function getSubscriptionHealthScore(subscription: UserSubscription): number {
  const checkResult = checkSubscriptionStatus(subscription)
  
  if (checkResult.isActive) {
    // Active subscription: score based on days until expiry
    if (checkResult.daysUntilExpiry > 30) return 100
    if (checkResult.daysUntilExpiry > 14) return 80
    if (checkResult.daysUntilExpiry > 7) return 60
    return 40
  }
  
  if (checkResult.isExpired) {
    // Expired subscription: score based on how long ago it expired
    const daysExpired = Math.abs(checkResult.daysUntilExpiry)
    if (daysExpired <= 7) return 20
    if (daysExpired <= 30) return 10
    return 0
  }
  
  return 0
}

export function getRecommendedAction(user: User & { subscription?: UserSubscription }): {
  action: 'none' | 'notify' | 'suspend' | 'extend' | 'upgrade'
  priority: 'low' | 'medium' | 'high' | 'critical'
  reason: string
} {
  const checkResult = checkSubscriptionStatus(user.subscription)
  
  if (checkResult.isExpired && !isInGracePeriod(user.subscription!)) {
    return {
      action: 'suspend',
      priority: 'critical',
      reason: 'Subscription expired and grace period exceeded'
    }
  }
  
  if (checkResult.isExpired && isInGracePeriod(user.subscription!)) {
    return {
      action: 'notify',
      priority: 'high',
      reason: 'Subscription expired but within grace period'
    }
  }
  
  if (checkResult.shouldNotify) {
    return {
      action: 'notify',
      priority: 'medium',
      reason: `Subscription expires in ${checkResult.daysUntilExpiry} days`
    }
  }
  
  if (checkResult.isActive && checkResult.daysUntilExpiry > 30) {
    return {
      action: 'none',
      priority: 'low',
      reason: 'Subscription is active and healthy'
    }
  }
  
  return {
    action: 'none',
    priority: 'low',
    reason: 'No action required'
  }
}
