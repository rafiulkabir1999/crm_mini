
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// CREATE review
export async function POST(req: Request) {
  const { customer, rating, comment, productId, packageId } = await req.json();

  const review = await prisma.review.create({
    data: { customer, rating, comment, productId, packageId }
  });

  return NextResponse.json(review);
}

// GET all reviews (for debugging)
export async function GET() {
  const reviews = await prisma.review.findMany({
    include: { product: true, package: true }
  });
  return NextResponse.json(reviews);
}
