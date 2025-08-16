import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const role = searchParams.get('role')

    if (userId) {
      // Get specific user with subscription and usage
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: true,
          _count: {
            select: {
              customers: true,
              leads: true
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        )
      }

      // Transform to match expected format
      const userWithUsage = {
        ...user,
        usage: {
          customers: user._count.customers,
          leads: user._count.leads,
          landingPages: 0, // TODO: Implement landing page counting
          storageUsed: 0, // TODO: Implement storage calculation
          teamMembers: 1
        }
      }

      return NextResponse.json({
        success: true,
        data: userWithUsage
      })
    }

    // Get all users with optional filtering
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where.status = status
    }

    if (role) {
      where.role = role
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        subscription: true,
        _count: {
          select: {
            customers: true,
            leads: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match expected format
    const usersWithUsage = users.map(user => ({
      ...user,
      usage: {
        customers: user._count.customers,
        leads: user._count.leads,
        landingPages: 0, // TODO: Implement landing page counting
        storageUsed: 0, // TODO: Implement storage calculation
        teamMembers: 1
      }
    }))

    return NextResponse.json({
      success: true,
      data: usersWithUsage,
      total: usersWithUsage.length
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.name) {
      return NextResponse.json(
        { success: false, message: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password (generate a random one for now)
    const hashedPassword = await bcrypt.hash('changeme123', 10)

    // Create new user with subscription and usage
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
        role: body.role || "user",
        status: body.status || "pending",
        phone: body.phone || "",
        company: body.company || "",
        position: body.position || "",
        location: body.location || "",
        website: body.website || "",
        bio: body.bio || "",
        subscription: {
          create: {
            planId: body.subscriptionPlan || "starter",
            status: body.status === "active" ? "active" : "pending",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          }
        },
        usage: {
          create: {
            customers: 0,
            leads: 0,
            landingPages: 0,
            storageUsed: 0,
            teamMembers: 1
          }
        }
      },
      include: {
        subscription: true,
        usage: true
      }
    })

    console.log('New user created:', newUser)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUser
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        position: body.position,
        location: body.location,
        website: body.website,
        bio: body.bio,
        status: body.status,
        role: body.role
      },
      include: {
        subscription: true,
        usage: true
      }
    })

    console.log('User updated:', updatedUser)

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (this will also delete subscription and usage due to cascade)
    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    })

    console.log('User deleted:', deletedUser)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
