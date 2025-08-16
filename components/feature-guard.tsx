"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"
import { FeatureAccess } from "@/lib/types"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

interface FeatureGuardProps {
  children: ReactNode
  feature: keyof FeatureAccess
  fallback?: ReactNode
  showUpgradePrompt?: boolean
}

interface UpgradePromptProps {
  requiredPlan: string
  feature: string
  description: string
}

function UpgradePrompt({ requiredPlan, feature, description }: UpgradePromptProps) {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === requiredPlan)
  
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter':
        return <Zap className="w-5 h-5" />
      case 'professional':
        return <Star className="w-5 h-5" />
      case 'business':
        return <Crown className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <CardTitle className="text-lg">Feature Locked</CardTitle>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          {getPlanIcon(requiredPlan)}
          <span className="font-medium">{plan?.name} Plan Required</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/pricing">
            <Button size="sm">
              View Plans
            </Button>
          </Link>
          <Link href={`/signup?plan=${requiredPlan}`}>
            <Button variant="outline" size="sm">
              Upgrade Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock feature access - replace with real subscription data
const mockFeatureAccess: FeatureAccess = {
  canCreateCustomers: true,
  canCreateLeads: true,
  canCreateLandingPages: false, // Requires Professional plan
  canInviteTeamMembers: false, // Requires Professional plan
  canExportData: false, // Requires Professional plan
  canAccessAnalytics: false, // Requires Professional plan
  canCustomizeTheme: false, // Requires Professional plan
  maxCustomers: 10,
  maxLeads: 25,
  maxLandingPages: 0,
  maxStorage: 100,
  maxTeamMembers: 1
}

const featureRequirements: Record<keyof FeatureAccess, { plan: string; description: string }> = {
  canCreateCustomers: { plan: 'starter', description: 'Create and manage customer records' },
  canCreateLeads: { plan: 'starter', description: 'Track and manage sales leads' },
  canCreateLandingPages: { plan: 'professional', description: 'Create custom landing pages for lead generation' },
  canInviteTeamMembers: { plan: 'professional', description: 'Invite team members to collaborate' },
  canExportData: { plan: 'professional', description: 'Export your data in various formats' },
  canAccessAnalytics: { plan: 'professional', description: 'Access advanced analytics and reporting' },
  canCustomizeTheme: { plan: 'professional', description: 'Customize your dashboard appearance' },
  maxCustomers: { plan: 'professional', description: 'Increase customer limit' },
  maxLeads: { plan: 'professional', description: 'Increase lead limit' },
  maxLandingPages: { plan: 'professional', description: 'Create multiple landing pages' },
  maxStorage: { plan: 'professional', description: 'Increase storage capacity' },
  maxTeamMembers: { plan: 'professional', description: 'Add team members' }
}

export function FeatureGuard({ 
  children, 
  feature, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGuardProps) {
  const hasAccess = mockFeatureAccess[feature]
  
  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (!showUpgradePrompt) {
    return null
  }

  const requirement = featureRequirements[feature]
  
  return (
    <UpgradePrompt
      requiredPlan={requirement.plan}
      feature={feature}
      description={requirement.description}
    />
  )
}

// Usage limit guard for specific features
interface UsageGuardProps {
  children: ReactNode
  feature: 'customers' | 'leads' | 'landingPages' | 'storage' | 'teamMembers'
  currentUsage: number
  fallback?: ReactNode
}

export function UsageGuard({ children, feature, currentUsage, fallback }: UsageGuardProps) {
  const limit = mockFeatureAccess[`max${feature.charAt(0).toUpperCase() + feature.slice(1)}` as keyof FeatureAccess] as number
  
  if (limit === -1 || limit === Infinity || currentUsage < limit) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <Lock className="w-8 h-8 text-orange-400" />
        </div>
        <CardTitle className="text-lg">Limit Reached</CardTitle>
        <p className="text-sm text-muted-foreground">
          You've reached your {feature} limit for your current plan.
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-orange-600">
            {currentUsage} / {limit} {feature}
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/pricing">
            <Button size="sm">
              View Plans
            </Button>
          </Link>
          <Link href="/billing">
            <Button variant="outline" size="sm">
              Manage Usage
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
