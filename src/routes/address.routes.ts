import { Router } from "express";
import { addAddress, getAllAddress } from "../controllers/address.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, addAddress);
router.get("/", authenticate, getAllAddress);

export default router;
