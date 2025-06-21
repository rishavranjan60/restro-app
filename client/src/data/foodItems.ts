import { FoodItem } from "../types/types";

export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Chicken Biryani",
    quantity: "Full",
    price: 300,
    category: "Chicken Biryani",
    type: "Non-Veg",
    eta: "20 min",
    image: "/images/biryani.jpg",
    description: "Spicy and flavorful chicken biryani",
  },
  {
    id: 2,
    name: "Veg Momo",
    quantity: "Full",
    price: 250,
    category: "MoMo",
    type: "Veg",
    eta: "15 min",
    image: "/images/momo.jpg",
    description: "Steamed dumplings stuffed with vegetables",
  },
  // ...add all others like this
];
