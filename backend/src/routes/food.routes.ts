import express from 'express';
import multer from 'multer';
import { storage } from '../../utils/cloudinary';
import { addFood } from '../controllers/food.controller'; // fixed name

const router = express.Router();
const upload = multer({ storage });

router.post('/', upload.single('image'), addFood); // fixed handler

export default router;
