import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, decodeToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 GET /api/auth/me called");

    // 1️⃣ Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    console.log("🔹 Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token provided");
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7); // remove "Bearer " prefix
    console.log("🔹 Token extracted:", token);

    // 2️⃣ Verify token (checks signature and expiration)
    const decoded = verifyToken(token) as { userId: string; exp: number };
    if (!decoded) {
      console.log("❌ Token verification failed or expired");
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    console.log("✅ Token verified payload:", decoded);

    // 3️⃣ Optional: decode token for debugging (no security check)
    const debugPayload = decodeToken(token);
    console.log("📝 Decoded token (no verify, debug only):", debugPayload);

    // 4️⃣ Find user in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    console.log("🔹 User fetched from DB:", user);
    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("✅ Returning user info:", user);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("🔥 Get user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
