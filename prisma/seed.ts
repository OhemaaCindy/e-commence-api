import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Users
  const adminEmail = "admin@gmail.com";
  const adminPassword = await bcrypt.hash("password", 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      username: "admin",
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      username: "user1",
      email: "user1@example.com",
      password: await bcrypt.hash("password", 10),
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      username: "user2",
      email: "user2@example.com",
      password: await bcrypt.hash("password", 10),
      role: "USER",
    },
  });

  // Categories
  const catCloth = await prisma.category.upsert({
    where: { name: "Cloth" },
    update: {},
    create: { name: "Cloth" },
  });
  const catShoes = await prisma.category.upsert({
    where: { name: "Shoes" },
    update: {},
    create: { name: "Shoes" },
  });
  const catElectronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics" },
  });

  // Products
  const prod1 = await prisma.product.create({
    data: {
      name: "Nice Cloth",
      description: "Comfortable cotton shirt",
      price: 500,
      quantity: 10,
      brand: "Nike",
      image: "",
      categoryId: catCloth.id,
    },
  });
  const prod2 = await prisma.product.create({
    data: {
      name: "Running Shoes",
      description: "Lightweight running shoes",
      price: 1200,
      quantity: 8,
      brand: "Adidas",
      image: "",
      categoryId: catShoes.id,
    },
  });
  const prod3 = await prisma.product.create({
    data: {
      name: "Headphones",
      description: "Noise-cancelling headphones",
      price: 2000,
      quantity: 5,
      brand: "Sony",
      image: "",
      categoryId: catElectronics.id,
    },
  });

  // Orders (for user1)
  await prisma.order.create({
    data: {
      orderItems: [
        {
          name: prod1.name,
          qty: 2,
          image: prod1.image || "",
          price: prod1.price,
          productId: prod1.id,
        },
        {
          name: prod2.name,
          qty: 1,
          image: prod2.image || "",
          price: prod2.price,
          productId: prod2.id,
        },
      ],
      shippingAddress: {
        address: "123 Main St",
        city: "Accra",
        postalCode: "00233",
        country: "GH",
      },
      paymentMethod: "Momo",
      totalPrice: 2 * prod1.price + prod2.price,
    },
  });

  console.log("Seed complete:", {
    admin: admin.email,
    users: [user1.email, user2.email],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
