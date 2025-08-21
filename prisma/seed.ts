import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ----------------- Subscription Plans -----------------
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 1500,
      landingPages: 1,
      standardPages: 3,
      storage: 1024,
      teamMembers: 1
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 2000,
      landingPages: 3,
      standardPages: 8,
      storage: 5120,
      teamMembers: 3
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 3000,
      landingPages: 8,
      standardPages: -1,
      storage: 20480,
      teamMembers: -1
    }
  ]

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: {},
      create: plan
    })
  }

  // ----------------- Users -----------------
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      status: 'active'
    },
    {
      email: 'user@example.com',
      password: 'user123',
      name: 'Regular User',
      role: 'user',
      status: 'active'
    },
    {
      email: 'suspended@example.com',
      password: 'suspend123',
      name: 'Suspended User',
      role: 'user',
      status: 'suspended'
    }
  ]

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u
    })

    // ----------------- User Subscriptions -----------------
    await prisma.userSubscription.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        planId: u.role === 'admin' ? 'pro' : 'starter',
        status: u.status === 'active' ? 'active' : 'pending',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false
      }
    })

    // ----------------- User Usage -----------------
    await prisma.userUsage.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        customers: 0,
        leads: 0,
        landingPages: 0,
        storageUsed: 0,
        teamMembers: 1
      }
    })
  }

  // ----------------- Sample Products -----------------
  const products = [
    { name: 'Product A', description: 'First product', price: 100 },
    { name: 'Product B', description: 'Second product', price: 200 },
    { name: 'Product C', description: 'Third product', price: 300 }
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.name }, // using name as unique key for simplicity
      update: {},
      create: {
        id: p.name,
        name: p.name,
        description: p.description,
        price: p.price,
        status: 'active'
      }
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
