import express from 'express';
import { upload } from '../utils/cloudinary';
import { addFood, getFoods } from '../controllers/food.controller';

const router = express.Router();

// ✅ GET all foods
router.get('/', getFoods);

// ✅ POST new food
router.post('/', upload.single('image'), addFood);

export default router;
