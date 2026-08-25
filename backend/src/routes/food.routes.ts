import express from "express";
import { upload } from "../utils/cloudinary";
import {
  addFood,
  getFoods,
  updateFood,
  deleteFood,
} from "../controllers/food.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getFoods);

router.post(
  "/",
  requireAdmin,
  upload.single("image"),
  addFood
);

router.put(
  "/:id",
  requireAdmin,
  upload.single("image"),
  updateFood
);

router.delete(
  "/:id",
  requireAdmin,
  deleteFood
);

export default router;