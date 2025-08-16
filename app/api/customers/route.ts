import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for customer
const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
})

// GET - Get all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const userId = searchParams.get('userId')

    // Mock customers data
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        company: 'Tech Corp',
        notes: 'Potential high-value customer',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        userId: 'admin-1'
      },
      {
        id: 'cust-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        company: 'Design Studio',
        notes: 'Interested in premium services',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        userId: 'admin-1'
      },
      {
        id: 'cust-3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1555123456',
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        company: 'Marketing Agency',
        notes: 'Regular customer',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        userId: 'user-1'
      }
    ]

    // Filter by search term
    let filteredCustomers = mockCustomers
    if (search) {
      filteredCustomers = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search) ||
        customer.company?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Pagination
    const total = filteredCustomers.length
    const skip = (page - 1) * limit
    const customers = filteredCustomers.slice(skip, skip + limit)

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = customerSchema.parse(body)

    // Create mock customer with generated ID
    const customer = {
      id: `cust-${Date.now()}`,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'admin-1' // Default to admin user
    }

    return NextResponse.json({
      success: true,
      message: 'Customer created successfully',
      customer,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 