import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
// GET all products with images
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { images: true }, // include images
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Something went wrong", detail: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const price = parseFloat(formData.get("price") as string);
    const status = (formData.get("status") as string) || "active";

    const files = formData.getAll("images").filter(f => f instanceof Blob) as Blob[];
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      let ext = ".jpg";
      if ("type" in file) {
        if (file.type === "image/png") ext = ".png";
        else if (file.type === "image/jpeg") ext = ".jpg";
      }
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      urls.push(`/uploads/${filename}`);
    }

    // Create product with images relation
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        status,
        images: {
          create: urls.map(url => ({ url })), // save file URLs in ProductImage table
        },
      },
      include: { images: true },
    });

    return NextResponse.json(product);
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Something went wrong", detail: err.message }, { status: 500 });
  }
}
