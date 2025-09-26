import { prisma } from "../config/prisma";

interface ShippingAddressInput {
  address: string;
  city: string;
  postalCode: string;
  country: string;
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
