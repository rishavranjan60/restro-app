import { Request, Response } from "express";
import { FoodModel } from "../models/food.model";
import { uploadImage } from "../utils/cloudinary";

export const addFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: "Image not uploaded or invalid.",
      });
      return;
    }

    const uploadedImage = await uploadImage(req.file.buffer);

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

    if (!name || !category || Number.isNaN(price)) {
      res.status(400).json({
        error: "Required fields are missing or invalid.",
      });
      return;
    }

    const newFood = new FoodModel({
      name,
      category,
      price,
      quantity,
      type,
      eta,
      image: uploadedImage.secure_url,
      description,
    });

    await newFood.save();

    res.status(201).json(newFood);
  } catch (error: any) {
    console.error("Error adding food item:", error);

    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
};

export const getFoods = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const foods = await FoodModel.find();

    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);

    res.status(500).json({
      error: "Failed to fetch food items",
    });
  }
};

export const updateFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Record<string, unknown> = {
      ...req.body,
    };

    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer);
      updateData.image = uploadedImage.secure_url;
    }

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    const updatedFood = await FoodModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFood) {
      res.status(404).json({
        error: "Food not found",
      });
      return;
    }

    res.json(updatedFood);
  } catch (error) {
    console.error("Error updating food:", error);

    res.status(500).json({
      error: "Failed to update food item",
    });
  }
};

export const deleteFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedFood = await FoodModel.findByIdAndDelete(id);

    if (!deletedFood) {
      res.status(404).json({
        error: "Food not found",
      });
      return;
    }

    res.json({
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting food:", error);

    res.status(500).json({
      error: "Failed to delete food item",
    });
  }
};