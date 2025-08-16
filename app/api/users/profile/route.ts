import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // In production, you would get the user ID from the authenticated session
    // const userId = getUserIdFromSession(request)
    
    // For now, get the first user (you can modify this based on your auth system)
    const userProfile = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        position: true,
        location: true,
        website: true,
        bio: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    })

    if (!userProfile) {
      return NextResponse.json(
        { success: false, message: 'No user profile found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: userProfile
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // In production, you would get the user ID from the authenticated session
    // const userId = getUserIdFromSession(request)
    
    // For now, update the first user (you can modify this based on your auth system)
    const updatedProfile = await prisma.user.updateMany({
      where: {}, // Update first user
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        position: body.position,
        location: body.location,
        website: body.website,
        bio: body.bio
      }
    })

    // Fetch the updated profile
    const userProfile = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        position: true,
        location: true,
        website: true,
        bio: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    })

    console.log('Profile updated:', userProfile)

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: userProfile
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
