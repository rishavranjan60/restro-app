import { Request, Response } from 'express';
import { FoodModel } from '../models/food.model';

// ✅ POST: Add new food
export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("==== BODY ====", JSON.stringify(req.body, null, 2));
    console.log("==== FILE ====", req.file);

    const { name, category, price: rawPrice, quantity, type, eta, description } = req.body;
    const image = req.file?.path; // Cloudinary image URL

    const price = Number(rawPrice);
    console.log("Price value converted to number:", price);
    console.log("Image URL:", image);

    if (!name || !category || !image || isNaN(price)) {
      console.log("❌ Missing or invalid fields", { name, category, rawPrice, image });
      res.status(400).json({ error: "Required fields missing or invalid" });
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
    console.log("✅ Food item saved:", newFood);
    res.status(201).json(newFood);
  } catch (error: any) {
    console.error("❌ Error adding food:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

// ✅ GET: Fetch all food items
export const getFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const foods = await FoodModel.find();
    res.status(200).json(foods);
  } catch (error: any) {
    console.error("❌ Error fetching foods:", error);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
};
