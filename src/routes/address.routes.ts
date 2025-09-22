import { Router } from "express";
import { addAddress, getAllAddress } from "../controllers/order.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// address
router.post("/", authenticate, addAddress);
router.get("/", authenticate, getAllAddress);

export default router;
