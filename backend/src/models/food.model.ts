import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  imageUrl: String,
});

export const FoodModel = mongoose.model("Food", foodSchema);
