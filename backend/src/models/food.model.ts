import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Pizza & Burger",
        "MoMo",
        "Chowmein",
        "Home Foods (Veg)",
        "Chicken Special",
        "Biryani",
        "Non-Veg Starter",
        "Beer",
        "Wine",
        "Cold Drinks & Juices",
      ],
    },
    price: { type: Number, required: true },
    quantity: { type: String, enum: ["Full", "Half"], required: true },
    type: { type: String, enum: ["Veg", "Non-Veg"], required: true },
    eta: { type: String },
    image: { type: String }, // Cloudinary URL
    description: { type: String },
  },
  { timestamps: true }
);

export const FoodModel = mongoose.model("Food", foodSchema);
