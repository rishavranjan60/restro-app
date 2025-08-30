// src/types/types.ts

// Centralized Category type (exactly matches backend)
export type Category =
  | "All"
  | "Pizza & Burger"
  | "MoMo"
  | "Chowmein"
  | "Home Foods (Veg)"
  | "Chicken Special"
  | "Biryani"
  | "Non-Veg Starter"
  | "Beer"
  | "Wine"
  | "Cold Drinks & Juices";

// Food Item interface (shared with backend + client)
export interface FoodItem {
  _id?: string;              // MongoDB id
  id?: number;               // Optional static id
  name: string;
  quantity: "Full" | "Half"; // ✅ match backend enum
  price: number;
  category: Category;
  type: "Veg" | "Non-Veg";
  eta: string;
  image?: string;            // Cloudinary URL
  description: string;
}

// Cart Item extends Food Item (used in client)
export interface CartItem extends FoodItem {
  cartQuantity: number;
}
