"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
router.get("/logout", user_controller_1.logout);
router.get("/check-auth", auth_1.authenticate, user_controller_1.authUser);
router.put("/:id", auth_1.authenticate, user_controller_1.update);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), user_controller_1.list);
router.get("/:id", auth_1.authenticate, user_controller_1.getOne);
exports.default = router;
//# sourceMappingURL=user.routes.js.map