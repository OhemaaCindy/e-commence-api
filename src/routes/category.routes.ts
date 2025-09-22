import { Router } from "express";
import {
  create,
  update,
  getOne,
  remove,
  list,
} from "../controllers/category.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { upload } from "../middlewares/multer-upload.middleware";

const router = Router();

router.get("/", list);
router.get("/:id", getOne);
// router.post("/", authenticate, authorize(["ADMIN"]), create);
// router.put("/:id", authenticate, authorize(["ADMIN"]), update);
// router.delete("/:id", authenticate, authorize(["ADMIN"]), remove);
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  create
);

router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  update
);

router.delete("/:id", authenticate, authorize(["ADMIN"]), remove);

export default router;
