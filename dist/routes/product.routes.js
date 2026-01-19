"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middlewares/auth");
const multer_upload_middleware_1 = require("../middlewares/multer-upload.middleware");
const router = (0, express_1.Router)();
// Create product with multiple images (1-5 images required)
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), multer_upload_middleware_1.upload.array("images", 5), // Accept up to 5 images
product_controller_1.create);
// Update product with optional new images
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), multer_upload_middleware_1.upload.array("images", 5), product_controller_1.update);
router.get("/:id", product_controller_1.getOne);
router.get("/", product_controller_1.list);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), product_controller_1.remove);
router.delete("/:productId/images/:imageId", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), product_controller_1.deleteImage);
exports.default = router;
//# sourceMappingURL=product.routes.js.map