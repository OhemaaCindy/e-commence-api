"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddress = createAddress;
exports.listAddress = listAddress;
const prisma_1 = require("../config/prisma");
async function createAddress(userId, addressData) {
    return prisma_1.prisma.address.create({
        data: {
            address: addressData.address,
            city: addressData.city,
            country: addressData.country,
            postalCode: addressData.postalCode,
            userId,
        },
    });
}
async function listAddress(userId) {
    return prisma_1.prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}
//# sourceMappingURL=address.service.js.map