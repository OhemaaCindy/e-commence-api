"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/address.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, address_controller_1.addAddress);
router.get("/", auth_1.authenticate, address_controller_1.getAllAddress);
exports.default = router;
//# sourceMappingURL=address.routes.js.map