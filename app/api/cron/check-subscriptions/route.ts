import { NextRequest, NextResponse } from 'next/server'
import { getUsersNeedingAction, generateExpiryNotification } from '@/lib/subscription-checker'

// This endpoint should be called by a cron job (e.g., daily at 9 AM)
// You can set this up with services like Vercel Cron, GitHub Actions, or external cron services

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a legitimate cron service
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real implementation, you would fetch users from your database
    // For now, we'll use mock data
    const mockUsers = [
      {
        id: "user_1",
        email: "john@example.com",
        name: "John Smith",
        status: "active",
        subscription: {
          id: "sub_1",
          planId: "professional",
          status: "active",
          currentPeriodStart: new Date("2024-01-01"),
          currentPeriodEnd: new Date("2024-02-01"),
          cancelAtPeriodEnd: false
        }
      },
      {
        id: "user_2",
        email: "sarah@example.com",
        name: "Sarah Johnson",
        status: "active",
        subscription: {
          id: "sub_2",
          planId: "starter",
          status: "active",
          currentPeriodStart: new Date("2024-01-05"),
          currentPeriodEnd: new Date("2024-02-05"),
          cancelAtPeriodEnd: false
        }
      },
      {
        id: "user_3",
        email: "mike@example.com",
        name: "Mike Wilson",
        status: "active",
        subscription: {
          id: "sub_3",
          planId: "business",
          status: "expired",
          currentPeriodStart: new Date("2023-12-15"),
          currentPeriodEnd: new Date("2024-01-15"),
          cancelAtPeriodEnd: false
        }
      }
    ]

    // Check which users need action
    const { toSuspend, toNotify, expired } = getUsersNeedingAction(mockUsers)

    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalUsers: mockUsers.length,
        toSuspend: toSuspend.length,
        toNotify: toNotify.length,
        expired: expired.length
      },
      actions: {
        suspended: [] as any[],
        notified: [] as any[],
        errors: [] as any[]
      }
    }

    // Process users to suspend
    for (const user of toSuspend) {
      try {
        // Call your admin API to suspend the user
        const suspendResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/users`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`
          },
          body: JSON.stringify({
            userId: user.id,
            action: 'suspend',
            reason: 'Subscription expired'
          })
        })

        if (suspendResponse.ok) {
          results.actions.suspended.push({
            userId: user.id,
            email: user.email,
            reason: 'Subscription expired'
          })
        } else {
          results.actions.errors.push({
            userId: user.id,
            action: 'suspend',
            error: 'Failed to suspend user'
          })
        }
      } catch (error) {
        results.actions.errors.push({
          userId: user.id,
          action: 'suspend',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Process users to notify
    for (const user of toNotify) {
      try {
        const notification = generateExpiryNotification(user)
        
        // Send email notification
        // In a real implementation, you would use your email service (SendGrid, AWS SES, etc.)
        console.log('Sending notification:', {
          to: user.email,
          subject: notification.subject,
          message: notification.message
        })

        results.actions.notified.push({
          userId: user.id,
          email: user.email,
          subject: notification.subject,
          urgency: notification.urgency
        })
      } catch (error) {
        results.actions.errors.push({
          userId: user.id,
          action: 'notify',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Log the results
    console.log('Subscription check completed:', results)

    return NextResponse.json({
      success: true,
      message: 'Subscription check completed',
      results
    })

  } catch (error) {
    console.error('Error in subscription check cron job:', error)
    return NextResponse.json({ 
      error: 'Failed to process subscription check',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const test = searchParams.get('test')

    if (test === 'true') {
      // Return a test response
      return NextResponse.json({
        success: true,
        message: 'Subscription check endpoint is working',
        timestamp: new Date().toISOString(),
        test: true
      })
    }

    // For GET requests, return information about the endpoint
    return NextResponse.json({
      endpoint: '/api/cron/check-subscriptions',
      method: 'POST',
      description: 'Cron job endpoint for checking subscription expiry',
      schedule: 'Daily at 9 AM (recommended)',
      actions: [
        'Suspend users with expired subscriptions',
        'Send expiry notifications',
        'Update subscription status'
      ]
    })

  } catch (error) {
    console.error('Error in GET subscription check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
