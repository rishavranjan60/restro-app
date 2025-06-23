import { Request, Response } from 'express';
import { FoodModel } from '../models/food.model';

export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, quantity, type, eta, description } = req.body;
    const image = req.file?.path; // Cloudinary image URL

    if (!name || !category || !price || !image) {
      res.status(400).json({ error: "Required fields missing" });
      return;
    }

    const newFood = new FoodModel({
      name,
      category,
      price,
      quantity,
      type,
      eta,
      image,
      description,
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
