import prisma from '@/lib/prisma';

interface CreateUserInput {
  email: string;
  name: string;
  role?: string;
  autoActivate?: boolean;
  subscriptionPlan: 'starter' | 'standard' | 'pro';
}

interface UpdateUserInput {
  userId: string;
  action: 'activate' | 'suspend' | 'extend_subscription' | 'update_plan';
  planId?: string;
  extensionDays?: number;
  reason?: string;
}

export const CUSTOM_PLANS = {
  starter: { id: 'starter', name: 'Starter', price: 1500 },
  standard: { id: 'standard', name: 'Standard', price: 2000 },
  pro: { id: 'pro', name: 'Professional', price: 3000 }
};

export const userService = {
  async getUsers(filters?: { status?: string; subscriptionStatus?: string; search?: string }) {
    const where: any = {};
    if (filters?.status && filters.status !== 'all') where.status = filters.status;
    if (filters?.subscriptionStatus && filters.subscriptionStatus !== 'all') where['subscription.status'] = filters.subscriptionStatus;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: { subscription: true, usage: true }
    });

    const stats = {
      total: await prisma.user.count(),
      active: await prisma.user.count({ where: { status: 'active' } }),
      suspended: await prisma.user.count({ where: { status: 'suspended' } }),
      expired: await prisma.user.count({ where: { subscription: { status: 'expired' } } }),
      pastDue: await prisma.user.count({ where: { subscription: { status: 'past_due' } } })
    };

    return { users, stats };
  },

  async createUser(data: CreateUserInput) {
    const plan = CUSTOM_PLANS[data.subscriptionPlan];
    if (!plan) throw new Error('Invalid subscription plan');

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error('User with this email already exists');

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || 'user',
        status: data.autoActivate ? 'active' : 'pending',
        subscription: {
          create: {
            planId: data.subscriptionPlan,
            status: data.autoActivate ? 'active' : 'pending',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false
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
      include: { subscription: true, usage: true }
    });

    return newUser;
  },

  async updateUser(data: UpdateUserInput) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { subscription: true }
    });
    if (!user) throw new Error('User not found');

    switch (data.action) {
      case 'activate':
        await prisma.user.update({ where: { id: user.id }, data: { status: 'active' } });
        break;
      case 'suspend':
        await prisma.user.update({ where: { id: user.id }, data: { status: 'suspended' } });
        break;
      case 'extend_subscription':
        if (data.extensionDays) {
          const newEnd = new Date(user.subscription.currentPeriodEnd);
          newEnd.setDate(newEnd.getDate() + data.extensionDays);
          await prisma.subscription.update({ where: { id: user.subscription.id }, data: { currentPeriodEnd: newEnd, status: 'active' } });
        }
        break;
      case 'update_plan':
        if (data.planId) {
          await prisma.subscription.update({ where: { id: user.subscription.id }, data: { planId: data.planId } });
        }
        break;
    }

    return prisma.user.findUnique({
      where: { id: data.userId },
      include: { subscription: true, usage: true }
    });
  }
};
