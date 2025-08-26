import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },  // Full/Half
  type: { type: String, enum: ["Veg", "Non-Veg"], required: true },
  eta: { type: String },
  image: { type: String }, // Cloudinary URL
  description: { type: String }
}, { timestamps: true });

export const FoodModel = mongoose.model('Food', foodSchema);
