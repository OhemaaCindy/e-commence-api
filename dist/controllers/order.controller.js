"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.list = list;
exports.getOne = getOne;
exports.pay = pay;
exports.getUserOrdersList = getUserOrdersList;
const order_service_1 = require("../services/order.service");
async function create(req, res) {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const order = await (0, order_service_1.createOrder)({ ...req.body, userId });
        res.status(201).json(order);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Create order failed" });
    }
}
async function list(req, res) {
    const orders = await (0, order_service_1.listOrders)();
    res.json(orders);
}
async function getOne(req, res) {
    const { id } = req.params;
    const order = await (0, order_service_1.getOrder)(id);
    if (!order)
        return res.status(404).json({ message: "Order not found" });
    res.json(order);
}
async function pay(req, res) {
    try {
        const { orderId: id, callback_url } = req.body;
        const updated = await (0, order_service_1.payOrder)(id);
        res.json({ callback_url, updated });
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Pay order failed" });
    }
}
async function getUserOrdersList(req, res) {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const orders = await (0, order_service_1.getUserOrders)(userId);
        res.json(orders);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Get user orders failed" });
    }
}
//# sourceMappingURL=order.controller.js.map