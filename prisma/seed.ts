import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
    },
  })

  console.log('✅ Users created')

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { phone: '+1234567890' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        company: 'Tech Corp',
        notes: 'Potential high-value customer',
        userId: adminUser.id,
      },
    }),
    prisma.customer.upsert({
      where: { phone: '+1987654321' },
      update: {},
      create: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        company: 'Design Studio',
        notes: 'Interested in premium services',
        userId: adminUser.id,
      },
    }),
    prisma.customer.upsert({
      where: { phone: '+1555123456' },
      update: {},
      create: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1555123456',
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        company: 'Marketing Agency',
        notes: 'Regular customer',
        userId: regularUser.id,
      },
    }),
  ])

  console.log('✅ Customers created')

  // Create sample leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        interestedProduct: 'Premium Software License',
        quantity: '5',
        leadSource: 'website',
        status: 'interested',
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: 'Very interested in enterprise features',
        customerId: customers[0].id,
        userId: adminUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        interestedProduct: 'Design Consultation',
        quantity: '1',
        leadSource: 'referral',
        status: 'contacted',
        notes: 'Referred by existing customer',
        customerId: customers[1].id,
        userId: adminUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        interestedProduct: 'Marketing Campaign',
        quantity: '3',
        leadSource: 'social-media',
        status: 'new',
        notes: 'Found us through LinkedIn',
        customerId: customers[2].id,
        userId: regularUser.id,
      },
    }),
  ])

  console.log('✅ Leads created')

  // Create sample sales
  const sales = await Promise.all([
    prisma.sale.create({
      data: {
        product: 'Basic Software License',
        quantity: 2,
        amount: 199.99,
        currency: 'USD',
        status: 'completed',
        saleDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        notes: 'Quick sale, satisfied customer',
        customerId: customers[0].id,
        userId: adminUser.id,
      },
    }),
    prisma.sale.create({
      data: {
        product: 'Premium Support Package',
        quantity: 1,
        amount: 299.99,
        currency: 'USD',
        status: 'pending',
        saleDate: new Date(),
        notes: 'Annual support contract',
        customerId: customers[1].id,
        userId: adminUser.id,
      },
    }),
  ])

  console.log('✅ Sales created')

  // Create sample accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        name: 'Software License Revenue',
        type: 'income',
        category: 'software-sales',
        amount: 399.98,
        currency: 'USD',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        description: 'Revenue from software license sales',
        customerId: customers[0].id,
        userId: adminUser.id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Office Supplies',
        type: 'expense',
        category: 'office',
        amount: 150.00,
        currency: 'USD',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        description: 'Monthly office supplies',
        userId: adminUser.id,
      },
    }),
    prisma.account.create({
      data: {
        name: 'Marketing Campaign',
        type: 'expense',
        category: 'marketing',
        amount: 500.00,
        currency: 'USD',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        description: 'Digital marketing campaign costs',
        userId: regularUser.id,
      },
    }),
  ])

  console.log('✅ Accounts created')

  console.log('🎉 Database seeded successfully!')
  console.log('📧 Login credentials:')
  console.log('   Admin: admin@example.com / admin123')
  console.log('   User: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 