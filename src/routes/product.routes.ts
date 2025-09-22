import { Router } from "express";
import {
  create,
  update,
  getOne,
  list,
  remove,
  deleteImage,
} from "../controllers/product.controller";
import { authenticate, authorize } from "../middlewares/auth";

import { upload } from "../middlewares/multer-upload.middleware";

const router = Router();

// Create product with multiple images (1-5 images required)
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  upload.array("images", 5), // Accept up to 5 images
  create
);

// Update product with optional new images
router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  upload.array("images", 5),
  update
);

router.get("/:id", getOne);
router.get("/", list);

router.delete("/:id", authenticate, authorize(["ADMIN"]), remove);
router.delete(
  "/:productId/images/:imageId",
  authenticate,
  authorize(["ADMIN"]),
  deleteImage
);

export default router;
