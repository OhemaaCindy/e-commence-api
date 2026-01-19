"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.listOrders = listOrders;
exports.getOrder = getOrder;
exports.payOrder = payOrder;
exports.getUserOrders = getUserOrders;
const prisma_1 = require("../config/prisma");
async function createOrder(input) {
    const totalPrice = input.orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const mappedItems = input.orderItems.map((i) => {
        var _a;
        return ({
            name: i.name,
            qty: i.qty,
            image: (_a = i.image) !== null && _a !== void 0 ? _a : null,
            price: i.price,
            productId: i.product,
        });
    });
    return prisma_1.prisma.order.create({
        data: {
            orderItems: mappedItems,
            shippingAddress: input.shippingAddress,
            paymentMethod: input.paymentMethod,
            totalPrice,
            userId: input.userId,
        },
    });
}
async function listOrders() {
    return prisma_1.prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}
async function getOrder(id) {
    return prisma_1.prisma.order.findUnique({ where: { id } });
}
async function payOrder(id) {
    return prisma_1.prisma.order.update({
        where: { id },
        data: { isPaid: true, paidAt: new Date() },
    });
}
async function getUserOrders(userId) {
    return prisma_1.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}
//# sourceMappingURL=order.service.js.map