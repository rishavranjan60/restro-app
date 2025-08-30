import { Request, Response } from 'express';
import { FoodModel } from '../models/food.model';

// POST: Add new food
export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(" Incoming form data (body):", req.body);
    console.log("📷 Uploaded file (req.file):", req.file);

    if (!req.file) {
      res.status(400).json({ error: "Image not uploaded or invalid." });
      return;
    }

    const image = req.file.path;
    const { name, category, price: rawPrice, quantity, type, eta, description } = req.body;
    const price = Number(rawPrice);

    if (!name || !category || !image || isNaN(price)) {
      res.status(400).json({ error: "Required fields missing or invalid." });
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
    console.error("❌ Error adding food item:", error);
    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
};

// GET: Fetch all food items
export const getFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const foods = await FoodModel.find();
    res.status(200).json(foods);
  } catch (error: any) {
    console.error("❌ Error fetching foods:", error);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
};

//  PUT: Update food
export const updateFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    // If a new image is uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedFood = await FoodModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedFood) {
      res.status(404).json({ error: "Food not found" });
      return;
    }

    res.json(updatedFood);
  } catch (error: any) {
    console.error("❌ Error updating food:", error);
    res.status(500).json({ error: "Failed to update food item" });
  }
};

//  DELETE: Remove food
export const deleteFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await FoodModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ error: "Food not found" });
      return;
    }

    res.json({ message: "Food deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting food:", error);
    res.status(500).json({ error: "Failed to delete food item" });
  }
};
