import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkSubscriptionStatus } from '@/lib/subscription-checker'

// Paths that don't require subscription check
const publicPaths = [
  '/login',
  '/signup',
  '/pricing',
  '/contact',
  '/api/auth',
  '/api/webhooks',
  '/_next',
  '/favicon.ico',
  '/api/cron'
]

// Paths that are always accessible (even for suspended users)
const alwaysAccessiblePaths = [
  '/billing',
  '/settings',
  '/api/billing',
  '/api/settings'
]

export function middleware(request: NextRequest) {
  // Temporarily disable middleware to fix login issues
  // TODO: Re-enable once auth system is properly integrated with cookies
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
