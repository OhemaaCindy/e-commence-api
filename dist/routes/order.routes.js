"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, order_controller_1.create);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), order_controller_1.list);
router.get("/my-orders", auth_1.authenticate, order_controller_1.getUserOrdersList);
router.get("/:id", auth_1.authenticate, order_controller_1.getOne);
router.post("/pay", auth_1.authenticate, order_controller_1.pay);
exports.default = router;
//# sourceMappingURL=order.routes.js.map