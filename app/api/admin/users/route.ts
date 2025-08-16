import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Custom subscription plans based on your requirements
const CUSTOM_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 1500,
    limits: {
      landingPages: 1,
      standardPages: 3,
      storage: 1024,
      teamMembers: 1
    }
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 2000,
    limits: {
      landingPages: 3,
      standardPages: 8,
      storage: 5120,
      teamMembers: 3
    }
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    price: 3000,
    limits: {
      landingPages: 8,
      standardPages: -1, // Unlimited
      storage: 20480,
      teamMembers: -1 // Unlimited
    }
  }
}

// Mock database - replace with real database
let mockUsers = [
  {
    id: "user_1",
    email: "john@example.com",
    name: "John Smith",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date("2024-01-25"),
    subscription: {
      id: "sub_1",
      planId: "pro",
      status: "active",
      currentPeriodStart: new Date("2024-01-01"),
      currentPeriodEnd: new Date("2024-02-01"),
      cancelAtPeriodEnd: false
    },
    usage: {
      customers: 127,
      leads: 342,
      landingPages: 3,
      storageUsed: 2048,
      teamMembers: 2
    }
  },
  {
    id: "user_2",
    email: "sarah@example.com",
    name: "Sarah Johnson",
    role: "user",
    status: "active",
    createdAt: new Date("2024-01-05"),
    lastLogin: new Date("2024-01-24"),
    subscription: {
      id: "sub_2",
      planId: "starter",
      status: "active",
      currentPeriodStart: new Date("2024-01-05"),
      currentPeriodEnd: new Date("2024-02-05"),
      cancelAtPeriodEnd: false
    },
    usage: {
      customers: 45,
      leads: 89,
      landingPages: 0,
      storageUsed: 512,
      teamMembers: 1
    }
  },
  {
    id: "user_3",
    email: "mike@example.com",
    name: "Mike Wilson",
    role: "user",
    status: "suspended",
    createdAt: new Date("2023-12-15"),
    lastLogin: new Date("2024-01-20"),
    subscription: {
      id: "sub_3",
      planId: "standard",
      status: "expired",
      currentPeriodStart: new Date("2023-12-15"),
      currentPeriodEnd: new Date("2024-01-15"),
      cancelAtPeriodEnd: false
    },
    usage: {
      customers: 234,
      leads: 567,
      landingPages: 8,
      storageUsed: 8192,
      teamMembers: 4
    }
  }
]

const updateUserSchema = z.object({
  userId: z.string(),
  action: z.enum(['activate', 'suspend', 'extend_subscription', 'update_plan']),
  planId: z.string().optional(),
  extensionDays: z.number().optional(),
  reason: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const subscriptionStatus = searchParams.get('subscriptionStatus')
    const search = searchParams.get('search')

    let filteredUsers = mockUsers

    // Filter by status
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }

    // Filter by subscription status
    if (subscriptionStatus && subscriptionStatus !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.subscription.status === subscriptionStatus)
    }

    // Filter by search
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      users: filteredUsers,
      total: filteredUsers.length,
      stats: {
        total: mockUsers.length,
        active: mockUsers.filter(u => u.status === "active").length,
        suspended: mockUsers.filter(u => u.status === "suspended").length,
        expired: mockUsers.filter(u => u.subscription.status === "expired").length,
        pastDue: mockUsers.filter(u => u.subscription.status === "past_due").length
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    const userIndex = mockUsers.findIndex(user => user.id === validatedData.userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = mockUsers[userIndex]

    switch (validatedData.action) {
      case 'activate':
        user.status = 'active'
        break

      case 'suspend':
        user.status = 'suspended'
        break

      case 'extend_subscription':
        if (validatedData.extensionDays) {
          const newEndDate = new Date(user.subscription.currentPeriodEnd)
          newEndDate.setDate(newEndDate.getDate() + validatedData.extensionDays)
          user.subscription.currentPeriodEnd = newEndDate
          user.subscription.status = 'active'
        }
        break

      case 'update_plan':
        if (validatedData.planId) {
          user.subscription.planId = validatedData.planId
          // You would typically also update the plan details here
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update the user in the mock database
    mockUsers[userIndex] = user

    return NextResponse.json({
      success: true,
      message: `User ${validatedData.action} successful`,
      user: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.name || !body.subscriptionPlan) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, name, and subscriptionPlan are required' 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === body.email)
    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 })
    }

    // Get plan details
    const plan = CUSTOM_PLANS[body.subscriptionPlan as keyof typeof CUSTOM_PLANS]
    if (!plan) {
      return NextResponse.json({ 
        error: 'Invalid subscription plan' 
      }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email: body.email,
      name: body.name,
      role: body.role || "user",
      status: body.autoActivate ? "active" : (body.status || "pending"),
      createdAt: new Date(),
      lastLogin: null,
      subscription: {
        id: `sub_${Date.now()}`,
        planId: body.subscriptionPlan,
        status: body.autoActivate ? "active" : "pending",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false
      },
      usage: {
        customers: 0,
        leads: 0,
        landingPages: 0,
        storageUsed: 0,
        teamMembers: 1
      }
    }

    mockUsers.push(newUser)

    // Log the creation
    console.log('New user created:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      plan: plan.name,
      price: plan.price,
      status: newUser.status
    })

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser,
      plan: plan
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
