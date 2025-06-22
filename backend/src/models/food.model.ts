import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number },
  imageUrl: { type: String }, // optional if you're handling images
}, {
  timestamps: true // optional: adds createdAt and updatedAt
});

export const FoodModel = mongoose.model('Food', foodSchema);
