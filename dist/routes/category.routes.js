"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_1 = require("../middlewares/auth");
const multer_upload_middleware_1 = require("../middlewares/multer-upload.middleware");
const router = (0, express_1.Router)();
router.get("/", category_controller_1.list);
router.get("/:id", category_controller_1.getOne);
// router.post("/", authenticate, authorize(["ADMIN"]), create);
// router.put("/:id", authenticate, authorize(["ADMIN"]), update);
// router.delete("/:id", authenticate, authorize(["ADMIN"]), remove);
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), multer_upload_middleware_1.upload.single("image"), category_controller_1.create);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), multer_upload_middleware_1.upload.single("image"), category_controller_1.update);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), category_controller_1.remove);
exports.default = router;
//# sourceMappingURL=category.routes.js.map