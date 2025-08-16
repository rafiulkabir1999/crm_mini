import { SubscriptionPlan } from './types'

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    billingCycle: 'monthly',
    features: [
      'Up to 50 customers',
      'Up to 100 leads',
      '1 landing page',
      'Basic analytics',
      'Email support',
      '1GB storage'
    ],
    limits: {
      customers: 50,
      leads: 100,
      landingPages: 1,
      storage: 1024, // 1GB in MB
      teamMembers: 1
    },
    isActive: true
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29.99,
    billingCycle: 'monthly',
    features: [
      'Up to 500 customers',
      'Up to 1000 leads',
      '5 landing pages',
      'Advanced analytics',
      'Priority support',
      '10GB storage',
      'Team collaboration',
      'Custom branding',
      'Data export'
    ],
    limits: {
      customers: 500,
      leads: 1000,
      landingPages: 5,
      storage: 10240, // 10GB in MB
      teamMembers: 5
    },
    isPopular: true,
    isActive: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 79.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited customers',
      'Unlimited leads',
      'Unlimited landing pages',
      'Advanced analytics & reporting',
      '24/7 priority support',
      '100GB storage',
      'Unlimited team members',
      'Custom integrations',
      'White-label options',
      'API access',
      'Advanced security'
    ],
    limits: {
      customers: -1, // Unlimited
      leads: -1, // Unlimited
      landingPages: -1, // Unlimited
      storage: 102400, // 100GB in MB
      teamMembers: -1 // Unlimited
    },
    isActive: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.99,
    billingCycle: 'monthly',
    features: [
      'Everything in Business',
      'Custom pricing',
      'Dedicated account manager',
      'Custom development',
      'On-premise deployment',
      'Advanced security & compliance',
      'SLA guarantees',
      'Training & onboarding'
    ],
    limits: {
      customers: -1, // Unlimited
      leads: -1, // Unlimited
      landingPages: -1, // Unlimited
      storage: -1, // Unlimited
      teamMembers: -1 // Unlimited
    },
    isActive: true
  }
]

export const YEARLY_PLANS: SubscriptionPlan[] = SUBSCRIPTION_PLANS.map(plan => ({
  ...plan,
  price: Math.round(plan.price * 10), // 2 months free (10 months instead of 12)
  billingCycle: 'yearly' as const
}))

export function getPlanById(id: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): SubscriptionPlan | undefined {
  const plans = billingCycle === 'yearly' ? YEARLY_PLANS : SUBSCRIPTION_PLANS
  return plans.find(plan => plan.id === id)
}

export function getPopularPlan(): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.isPopular)
}

export function calculateYearlySavings(monthlyPrice: number): number {
  const yearlyPrice = monthlyPrice * 10 // 2 months free
  const fullYearPrice = monthlyPrice * 12
  return fullYearPrice - yearlyPrice
}
