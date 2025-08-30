import React from "react";
import { Category } from "../types/types";

interface Props {
  selected: Category;
  onChange: (category: Category) => void;
}

const categories: Category[] = [
  "All",
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
];

const CategoryFilter: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded ${
            selected === cat ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
