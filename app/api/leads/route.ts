import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for lead
const leadSchema = z.object({
  interestedProduct: z.string().min(1, 'Product is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  leadSource: z.string().min(1, 'Lead source is required'),
  status: z.enum(['new', 'contacted', 'interested', 'converted', 'lost']).default('new'),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
})

// GET - Get all leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const userId = searchParams.get('userId')

    // Mock leads data
    const mockLeads = [
      {
        id: 'lead-1',
        interestedProduct: 'Premium Software License',
        quantity: '5',
        leadSource: 'website',
        status: 'interested',
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: 'Very interested in enterprise features',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        customerId: 'cust-1',
        userId: 'admin-1',
        customer: {
          id: 'cust-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Tech Corp'
        }
      },
      {
        id: 'lead-2',
        interestedProduct: 'Design Consultation',
        quantity: '1',
        leadSource: 'referral',
        status: 'contacted',
        notes: 'Referred by existing customer',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        customerId: 'cust-2',
        userId: 'admin-1',
        customer: {
          id: 'cust-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1987654321',
          company: 'Design Studio'
        }
      },
      {
        id: 'lead-3',
        interestedProduct: 'Marketing Campaign',
        quantity: '3',
        leadSource: 'social-media',
        status: 'new',
        notes: 'Found us through LinkedIn',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        customerId: 'cust-3',
        userId: 'user-1',
        customer: {
          id: 'cust-3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1555123456',
          company: 'Marketing Agency'
        }
      }
    ]

    // Filter by search term and status
    let filteredLeads = mockLeads
    if (search) {
      filteredLeads = mockLeads.filter(lead =>
        lead.interestedProduct.toLowerCase().includes(search.toLowerCase()) ||
        lead.notes?.toLowerCase().includes(search.toLowerCase()) ||
        lead.customer.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === status)
    }

    // Pagination
    const total = filteredLeads.length
    const skip = (page - 1) * limit
    const leads = filteredLeads.slice(skip, skip + limit)

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get leads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: validatedData.customerId },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      lead,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 