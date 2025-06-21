import express from "express";
import multer from "multer";
import {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
} from "../controllers/food.controller";

const router = express.Router();

// For form-data requests (in case of image or rich forms)
const upload = multer(); // you can update this later for real file handling

router.get("/", getFoods);
router.post("/", upload.none(), addFood);
router.put("/:id", upload.none(), updateFood);
router.delete("/:id", deleteFood);

export default router;
