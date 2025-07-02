import { Request, Response } from 'express';
import { FoodModel } from '../models/food.model';

// ✅ POST: Add new food
export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
    
    console.log("==== BODY ====", req.body);
    console.log("==== FILE ====", req.file);

    6517
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
  } catch (error: any) {
    console.error("Error adding food:", error);

    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

// ✅ GET: Fetch all food items
export const getFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const foods = await FoodModel.find();
    res.status(200).json(foods);
  } catch (error: any) {
    console.error("Error fetching foods:", error);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
};
