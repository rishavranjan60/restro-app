import React from "react";
import { Category } from "../types/types";

interface Props {
  selected: Category;
  onChange: (category: Category) => void;
}

const categories: Category[] = [
  "All",
  "Chicken Biryani",
  "MoMo",
  "Chowmeine",
  "Non Veg Starter",
  "Beer",
  "Domestic Sprit",
];

const CategoryFilter: React.FC<Props> = ({ selected, onChange }) => (
  <div className="flex gap-2 flex-wrap mb-4">
    {categories.map((cat) => (
      <button
        key={cat}
        className={`px-3 py-1 border rounded-lg ${
          selected === cat ? "bg-yellow-500 text-black" : "text-white border-yellow-400"
        }`}
        onClick={() => onChange(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
