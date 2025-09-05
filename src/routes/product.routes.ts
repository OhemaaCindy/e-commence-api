import { Router } from "express";
import {
  create,
  update,
  getOne,
  list,
} from "../controllers/product.controller";
import { authenticate, authorize } from "../middlewares/auth";
import multer from "multer";
import path from "path";
import os from "os";
import { uploadImage } from "../controllers/product.controller";

const router = Router();
const upload = multer({ dest: path.join(os.tmpdir(), "uploads") });

router.post("/", authenticate, authorize(["ADMIN"]), create);
router.put("/:id", authenticate, authorize(["ADMIN"]), update);
router.get("/:id", getOne);
router.get("/", list);
router.post(
  "/upload",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  uploadImage
);

export default router;
