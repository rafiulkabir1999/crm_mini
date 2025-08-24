import prisma from "@/lib/prisma";

export const LandingPageService = {
  async list(userId?: string) {
    return prisma.landingPage.findMany({
      where: userId ? { users: { some: { userId } } } : {},
      include: { products: true, users: true },
    });
  },

  async get(id: string) {
    return prisma.landingPage.findUnique({
      where: { id },
      include: { products: true, users: true },
    });
  },

  async create(data: {
    name: string;
    url: string;
    productIds: string[];
    userId: string;
  }) {
    const { name, url, productIds, userId } = data;
    return prisma.landingPage.create({
      data: {
        name,
        url,
        products: {
          create: productIds.map((id) => ({ productId: id })),
        },
        users: {
          create: [{ userId }],
        },
      },
      include: { products: true, users: true },
    });
  },

  async update(id: string, data: Partial<{ name: string; url: string; status: string }>) {
    return prisma.landingPage.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.landingPage.delete({
      where: { id },
    });
  },
};
