import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding users...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      phone: '+91 98765 43210',
      company: 'Admin Corp',
      position: 'System Administrator',
      location: 'Mumbai, Maharashtra',
      website: 'https://admin.com',
      bio: 'System administrator with full access to all features.',
      subscription: {
        create: {
          planId: 'pro',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
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
    }
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
      status: 'active',
      phone: '+91 87654 32109',
      company: 'User Corp',
      position: 'Regular User',
      location: 'Delhi, India',
      website: 'https://user.com',
      bio: 'Regular user with standard access.',
      subscription: {
        create: {
          planId: 'starter',
          status: 'active',
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
    }
  })

  console.log('✅ Users seeded successfully!')
  console.log('Admin user:', adminUser.email)
  console.log('Regular user:', regularUser.email)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
