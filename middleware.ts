import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

const publicPaths = [
  '/login',
  '/signup',
  '/pricing',
  '/contact',
  '/_next',
  '/favicon.ico',
  '/api/auth/login',
  '/api/webhooks',
  '/api/cron'
]

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Skip public paths
  if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // // Only protect API routes
  // if (req.nextUrl.pathname.startsWith('/api')) {
  //   const authHeader = req.headers.get('authorization')
  //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  //   }

  //   const token = authHeader.substring(7)
  //   console.log(token, 'token from middleware')
  //   const decoded = verifyToken(token)
  //   console.log("end")

  //   if (!decoded) {
  //     return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  //   }

  //   // Optionally, attach user info to request headers for downstream API
  //   // req.headers.set('x-user-id', decoded.userId) // Not directly mutable in NextRequest
  //   // For server functions, use your route to read token again
  // }

  // All other requests allowed
  return NextResponse.next()
}
