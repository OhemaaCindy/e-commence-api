import { prisma } from "../config/prisma";

interface OrderItemInput {
  name: string;
  qty: number;
  image?: string;
  price: number;
  product: string;
}

interface ShippingAddressInput {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CreateOrderInput {
  orderItems: OrderItemInput[];
  shippingAddress: ShippingAddressInput;
  paymentMethod: string;
}

export async function createOrder(input: CreateOrderInput) {
  const totalPrice = input.orderItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );
  const mappedItems = input.orderItems.map((i) => ({
    name: i.name,
    qty: i.qty,
    image: i.image ?? null,
    price: i.price,
    productId: i.product,
  }));
  return prisma.order.create({
    data: {
      orderItems: mappedItems,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      totalPrice,
    },
  });
}

export async function listOrders() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({ where: { id } });
}

export async function payOrder(id: string) {
  return prisma.order.update({
    where: { id },
    data: { isPaid: true, paidAt: new Date() },
  });
}

export async function createAddress(
  userId: string,
  addressData: ShippingAddressInput
) {
  return prisma.address.create({
    data: {
      address: addressData.address,
      city: addressData.city,
      country: addressData.country,
      postalCode: addressData.postalCode,
      userId,
    },
  });
}

export async function listAddress(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
