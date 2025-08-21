import { NextRequest, NextResponse } from 'next/server';
import { userService, CUSTOM_PLANS } from '@/services/backend/userService';
import { z } from 'zod';

const updateUserSchema = z.object({
  userId: z.string(),
  action: z.enum(['activate', 'suspend', 'extend_subscription', 'update_plan']),
  planId: z.string().optional(),
  extensionDays: z.number().optional(),
  reason: z.string().optional()
});

// GET /api/users
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const usersData = await userService.getUsers({
      status: searchParams.get('status') || undefined,
      subscriptionStatus: searchParams.get('subscriptionStatus') || undefined,
      search: searchParams.get('search') || undefined
    });
    return NextResponse.json(usersData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newUser = await userService.createUser({
      email: body.email,
      name: body.name,
      role: body.role,
      autoActivate: body.autoActivate,
      subscriptionPlan: body.subscriptionPlan
    });

    const plan = CUSTOM_PLANS[body.subscriptionPlan];

    return NextResponse.json({ success: true, user: newUser, plan }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 500 });
  }
}

// PATCH /api/users
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);

    const updatedUser = await userService.updateUser(validatedData);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 500 });
  }
}
