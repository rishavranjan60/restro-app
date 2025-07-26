import { Request, Response } from 'express';
import { FoodModel } from '../models/food.model';

// ✅ POST: Add new food
export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ Safe logging of incoming form data
    console.log("🟡 Incoming form data (body):", req.body);
    console.log("📷 Uploaded file (req.file):", req.file);

    // ⛔ If image is not uploaded
    if (!req.file) {
      console.error("❌ Image upload failed or not received.");
      res.status(400).json({ error: "Image not uploaded or invalid." });
      return;
    }

    // ✅ Extract the Cloudinary URL
    const image = req.file.path;

    // ✅ Extract fields from form data
    const {
      name,
      category,
      price: rawPrice,
      quantity,
      type,
      eta,
      description,
    } = req.body;

    const price = Number(rawPrice);

    // ✅ Validate required fields
    if (!name || !category || !image || isNaN(price)) {
      console.error("❌ Validation failed. Missing or invalid fields:", {
        nameMissing: !name,
        categoryMissing: !category,
        priceInvalid: isNaN(price),
        imageMissing: !image,
      });
      res.status(400).json({ error: "Required fields missing or invalid." });
      return;
    }

    // ✅ Create and save the food item
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
  console.error("❌ Error adding food item:", error);
  res.status(500).json({
    error: error.message || "Something went wrong",
    fullError: error
  });
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
