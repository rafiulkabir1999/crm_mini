import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Verify token (in real app, use a proper JWT library)
    const decodedToken = verifyMockJWT(token)
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000)
    if (decodedToken.exp < currentTime) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      )
    }
    
    // Mock users for bypassing database
    const mockUsers = [
      {
        id: 'admin-1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user',
        createdAt: new Date('2024-01-01')
      }
    ]
    
    // Find user by ID
    const user = mockUsers.find(u => u.id === decodedToken.userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock JWT verification - in real app, use a proper JWT library
function verifyMockJWT(token: string): any {
  try {
    const decoded = JSON.parse(atob(token))
    
    // Basic validation
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return null
    }
    
    return decoded
  } catch (error) {
    return null
  }
} 