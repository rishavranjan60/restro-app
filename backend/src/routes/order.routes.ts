import express from "express";
import { placeOrder, getOrders } from "../controllers/order.controller";

const router = express.Router();

router.post("/", placeOrder);   // POST /api/orders
router.get("/", getOrders);     // GET /api/orders

export default router;
