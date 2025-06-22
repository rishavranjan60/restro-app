import { Request, Response } from "express";
import { FoodModel } from "../models/food.model";

// GET /api/foods
export const getFoods = async (_: Request, res: Response): Promise<void> => {
  try {
    const foods = await FoodModel.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch foods" });
  }
};

// POST /api/foods
export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, quantity, type, eta, image, description } = req.body;

    if (!name || !category || !price) {
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
    res.status(500).json({ error: "Failed to create food" });
  }
};

// PUT /api/foods/:id
export const updateFood = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedFood = await FoodModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFood) {
      res.status(404).json({ error: "Food not found" });
      return;
    }
    res.json({ message: "Food updated", food: updatedFood });
  } catch (error) {
    res.status(500).json({ error: "Failed to update food" });
  }
};

// DELETE /api/foods/:id
export const deleteFood = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await FoodModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: "Food not found" });
      return;
    }
    res.json({ message: "Food deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete food" });
  }
};
