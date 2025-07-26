import { Request, Response } from 'express';
import { FoodModel } from '../models/food.model';

// ✅ POST: Add new food
export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🟡 Incoming form data:", JSON.stringify(req.body, null, 2));
    console.log("📷 Uploaded file:", JSON.stringify(req.file, null, 2));

    // ⛔ If image is not uploaded
    if (!req.file) {
      console.error("❌ Image upload failed or not received.");
      res.status(400).json({ error: "Image not uploaded or invalid." });
      return;
    }

    const image = req.file.path; // Cloudinary file URL

    // Extract fields
    const { name, category, price: rawPrice, quantity, type, eta, description } = req.body;
    const price = Number(rawPrice);

    // Validate required fields
    if (!name || !category || !image || isNaN(price)) {
      console.error("❌ Missing or invalid fields", {
        name,
        category,
        rawPrice,
        image,
      });
      res.status(400).json({ error: "Required fields missing or invalid" });
      return;
    }

    // Create and save the food item
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
    console.log("✅ Food item saved successfully:", newFood);
    res.status(201).json(newFood);
  } catch (error: any) {
    console.error("❌ Error adding food:", error?.message);
    console.error("📜 Full error object:", error);
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
