import { NextResponse } from "next/server";

// CREATE package with products
export async function POST(req: Request) {
  const { name, description, basePrice, products } = await req.json();

  const newPackage = await prisma.package.create({
    data: {
      name,
      description,
      basePrice,
      products: {
        create: products.map((p: any) => ({
          productId: p.productId,
          quantity: p.quantity,
        }))
      }
    },
    include: {
      products: {
        include: { product: true }
      }
    }
  });

  return NextResponse.json(newPackage);
}

// GET all packages with products
export async function GET() {
  const packages = await prisma.package.findMany({
    include: {
      products: { include: { product: true } }
    }
  });
  return NextResponse.json(packages);
}
