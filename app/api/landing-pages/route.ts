import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const landingPage = await prisma.landingPage.create({
      data: {
        name: body.name,
        coverPhoto: body.coverPhoto,
        profilePhoto: body.profilePhoto,
        caption: body.caption,
        brandInfo: body.brandInfo,
        productName: body.productName,
        productImage: body.productImage,
        productDescription: body.productDescription,
        price: body.price,
        showQuantity: body.showQuantity,
        showAddress: body.showAddress,
        footerText: body.footerText,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
        published: body.published ?? false,
        analytics: body.analytics ?? true
      },
    });

    return NextResponse.json({ success: true, landingPage });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to save landing page" }, { status: 500 });
  }
}
