// types.ts (shared between client & admin)

export type Category =
  | "All"
  | "Pizza & Burger"
  | "MoMo"
  | "Chowmein"
  | "Home Foods (Veg)"
  | "Chicken Special"
  | "Chicken Biryani"    // added this
  | "Biryani"
  | "Non-Veg Starter"
  | "Beer"
  | "Wine"
  | "Cold Drinks & Juices";

export interface FoodItem {
  id?: number;                // for static/demo foods
  _id?: string;               // MongoDB document id
  name: string;
  quantity: "Full" | "Half";  // matches backend
  price: number;
  category: Category;         // strongly typed
  type: "Veg" | "Non-Veg";
  eta: string;
  image?: string;             // Cloudinary URL
  description: string;
}

export interface CartItem extends FoodItem {
  cartQuantity: number;       // for client cart
}
