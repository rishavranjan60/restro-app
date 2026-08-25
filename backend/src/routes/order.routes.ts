import express from "express";
import {
  placeOrder,
  getOrders,
} from "../controllers/order.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", placeOrder);
router.get("/", requireAdmin, getOrders);

export default router;