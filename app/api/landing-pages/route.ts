import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const landingPage = await prisma.landingPage.create({
//       data: {
//         name: body.name,
//         coverPhoto: body.coverPhoto,
//         profilePhoto: body.profilePhoto,
//         caption: body.caption,
//         brandInfo: body.brandInfo,
//         productName: body.productName,
//         productImage: body.productImage,
//         productDescription: body.productDescription,
//         price: body.price,
//         showQuantity: body.showQuantity,
//         showAddress: body.showAddress,
//         footerText: body.footerText,
//         slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
//         published: body.published ?? false,
//         analytics: body.analytics ?? true
//       },
//     });

//     return NextResponse.json({ success: true, landingPage });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, error: "Failed to save landing page" }, { status: 500 });
//   }
// }

import { LandingPageService } from "@/lib/services/backend/landingpageService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;

  const pages = await LandingPageService.list(userId);
  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, url, productIds, userId } = body;

  if (!name || !url || !productIds || !userId)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const page = await LandingPageService.create({ name, url, productIds, userId });
  return NextResponse.json(page, { status: 201 });
}
