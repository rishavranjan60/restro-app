import express from 'express';
import { upload } from '../utils/cloudinary';
import { addFood, getFoods, updateFood, deleteFood } from '../controllers/food.controller';

const router = express.Router();

// ✅ GET all foods
router.get('/', getFoods);

// ✅ POST new food
router.post('/', upload.single('image'), addFood);

// 🆕 ✅ PUT: Update existing food
router.put('/:id', upload.single('image'), updateFood);

// 🆕 ✅ DELETE: Remove food
router.delete('/:id', deleteFood);

export default router;
