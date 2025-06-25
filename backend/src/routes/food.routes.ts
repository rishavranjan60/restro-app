import express from 'express';
import multer from 'multer';
import { storage } from '../utils/cloudinary';
import { addFood, getFoods } from '../controllers/food.controller';

const router = express.Router();
const upload = multer({ storage });

// ✅ GET all food items
router.get('/', getFoods);

// ✅ POST a new food item with image upload
router.post('/', upload.single('image'), addFood);

export default router;
