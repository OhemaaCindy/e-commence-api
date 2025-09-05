import { Router } from "express";
import {
  register,
  login,
  update,
  list,
  getOne,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/:id", authenticate, update);
router.get("/", authenticate, authorize(["ADMIN"]), list);
router.get("/:id", authenticate, getOne);

export default router;
