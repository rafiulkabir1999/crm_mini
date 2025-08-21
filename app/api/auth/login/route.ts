import { NextRequest, NextResponse } from 'next/server'
import { loginService } from '@/services/backend/authService'
import { z } from 'zod'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await loginService(body) // ✅ this now works
    console.log(result, "result")
    return NextResponse.json({
      success: true,
      message: "Login successful",
      ...result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message === "Invalid email or password" ? 401 : 500 }
    )
  }
}