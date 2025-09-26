import { Router } from "express";
import {
  create,
  list,
  getOne,
  pay,
  getUserOrdersList,
} from "../controllers/order.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, authorize(["ADMIN"]), list);
router.get("/my-orders", authenticate, getUserOrdersList);
router.get("/:id", authenticate, getOne);
router.post("/pay", authenticate, pay);

export default router;
