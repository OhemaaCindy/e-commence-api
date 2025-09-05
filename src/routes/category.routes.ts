import { Router } from "express";
import {
  create,
  update,
  getOne,
  remove,
  list,
} from "../controllers/category.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, authorize(["ADMIN"]), create);
router.put("/:id", authenticate, authorize(["ADMIN"]), update);
router.get("/:id", getOne);
router.delete("/:id", authenticate, authorize(["ADMIN"]), remove);
router.get("/", list);

export default router;
