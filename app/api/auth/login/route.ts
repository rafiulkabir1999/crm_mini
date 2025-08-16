import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for login request
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Login request body:', body)
    
    // Validate request body
    const validatedData = loginSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    // Hardcoded users for bypassing database
    const mockUsers = [
      {
        id: 'admin-1',
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        id: 'user-1',
        email: 'user@example.com',
        password: 'user123',
        name: 'Regular User',
        role: 'user'
      }
    ]
    
    // Find user by email
    const user = mockUsers.find(u => u.email === validatedData.email)
    console.log('Found user:', user)
    
    if (!user) {
      console.log('User not found for email:', validatedData.email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Check password (simple string comparison)
    console.log('Comparing passwords:', { provided: validatedData.password, expected: user.password })
    if (user.password !== validatedData.password) {
      console.log('Password mismatch')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = generateMockJWT(user)
    
    // Create response without sensitive data
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: 'active',
      subscription: {
        id: `sub_${user.id}`,
        planId: user.role === 'admin' ? 'enterprise' : 'professional',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token: token,
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock JWT generation - in real app, use a proper JWT library
function generateMockJWT(user: any): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  }
  
  // In real app, this would be properly signed
  return btoa(JSON.stringify(payload))
} 