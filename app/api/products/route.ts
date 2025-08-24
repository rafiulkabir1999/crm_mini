import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt"; // verify should return the decoded payload

export async function GET(req: Request) {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify and decode token
    let decoded: any;
    try {
      decoded = await verifyToken(token); // should return payload like { id, email }
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // 3️⃣ Extract user id from payload
    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json({ error: decoded }, { status: 401 });
    }

    // 4️⃣ Fetch only products belonging to this user
    const products = await prisma.product.findMany({
      where: {
        owners: {
          some: { userId }, // assumes a relation `owners` table linking products ↔ users
        },
      },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong", detail: err.message },
      { status: 500 }
    );
  }
}


// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const name = formData.get("name") as string;
//     const description = (formData.get("description") as string) || null;
//     const price = parseFloat(formData.get("price") as string);
//     const status = (formData.get("status") as string) || "active";

//     const files = formData.getAll("images").filter(f => f instanceof Blob) as Blob[];
//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     const urls: string[] = [];

//     for (const file of files) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       let ext = ".jpg";
//       if ("type" in file) {
//         if (file.type === "image/png") ext = ".png";
//         else if (file.type === "image/jpeg") ext = ".jpg";
//       }
//       const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
//       await fs.writeFile(path.join(uploadDir, filename), buffer);
//       urls.push(`/uploads/${filename}`);
//     }

//     // Create product with images relation
//     const product = await prisma.product.create({
//       data: {
//         name,
//         description,
//         price,
//         status,
//         images: {
//           create: urls.map(url => ({ url })), // save file URLs in ProductImage table
//         },
//       },
//       include: { images: true },
//     });

//     return NextResponse.json(product);
//   } catch (err: any) {
//     console.error("API ERROR:", err);
//     return NextResponse.json({ error: "Something went wrong", detail: err.message }, { status: 500 });
//   }
// }




export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));

    // Parse owners
    const owners: { userId: string }[] = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^owners\[(\d+)\]\[userId\]$/);
      if (match) {
        const index = Number(match[1]);
        owners[index] = { userId: value as string };
      }
    }

    // Parse images
    const images: { url: string }[] = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^images\[(\d+)\]\[url\]$/);
      if (match) {
        const index = Number(match[1]);
        images[index] = { url: value as string };
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        status: "active",
        images: { create: images },
        owners: {
          create: owners.map((o) => ({
            user: { connect: { id: o.userId } },
          })),
        },
      },
      include: {
        images: true,
        owners: { include: { user: true } },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

