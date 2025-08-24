import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

async function main() {
  // Create Subscription Plans
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      id: "basic",
      name: "Basic",
      price: 0,
      landingPages: 1,
      standardPages: 5,
      storage: 100,
      teamMembers: 1,
    },
  });

  const proPlan = await prisma.subscriptionPlan.create({
    data: {
      id: "pro",
      name: "Pro",
      price: 29.99,
      landingPages: 10,
      standardPages: 50,
      storage: 1000,
      teamMembers: 5,
    },
  });

  // Create a User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
      status: "active",
      products: {
        create: [], // will attach later
      },
      subscription: {
        create: {
          planId: proPlan.id,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      },
      usage: {
        create: {},
      },
    },
  });

  // Create Products with Images
  const product1 = await prisma.product.create({
    data: {
      name: "Product A",
      description: "First demo product",
      price: 49.99,
      images: {
        create: [
          { url: "/uploads/product-a-1.png" },
          { url: "/uploads/product-a-2.png" },
        ],
      },
      owners: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Product B",
      description: "Second demo product",
      price: 99.99,
      images: {
        create: [{ url: "/uploads/product-b.png" }],
      },
      owners: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  // Create Landing Page with attached Product
  const landingPage = await prisma.landingPage.create({
    data: {
      name: "Landing Page 1",
      url: "landing-page-1",
      description: "Demo landing page",
      users: {
        create: {
          userId: user.id,
        },
      },
      products: {
        create: {
          productId: product1.id,
        },
      },
    },
  });

  console.log({ user, product1, product2, landingPage });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
