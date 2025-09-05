import { prisma } from "../config/prisma";

interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  brand?: string;
  image?: string;
}

export async function createProduct(input: ProductInput) {
  const { category, ...rest } = input;
  return prisma.product.create({ data: { ...rest, categoryId: category } });
}

export async function updateProduct(id: string, input: ProductInput) {
  const { category, ...rest } = input;
  return prisma.product.update({
    where: { id },
    data: { ...rest, categoryId: category },
  });
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function listProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}
