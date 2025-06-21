// types.ts

export interface FoodItem {
  id?: number;         // For static foods
  _id?: string;        // For MongoDB documents
  name: string;
  quantity: string;
  price: number;
  category: string;
  type: "Veg" | "Non-Veg";
  eta: string;
  image?: string;
  description: string;
}

export interface CartItem extends FoodItem {
  cartQuantity: number;
}

export type Category = "All" | "MoMo" | "Chowmeine" | "Beer" | "Chicken Biryani" | string;
