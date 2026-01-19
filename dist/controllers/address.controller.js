"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAddress = addAddress;
exports.getAllAddress = getAllAddress;
const address_service_1 = require("../services/address.service");
async function addAddress(req, res) {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const address = await (0, address_service_1.createAddress)(userId, req.body);
        res.status(201).json(address);
    }
    catch (e) {
        res.status(400).json({ message: e.message || "Create address failed" });
    }
}
async function getAllAddress(req, res) {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const address = await (0, address_service_1.listAddress)(userId);
    res.json(address);
}
//# sourceMappingURL=address.controller.js.map