import React from "react";
import { Category } from "../types/types";

interface Props {
  selected: Category;
  onChange: (category: Category) => void;
  categories: Category[];
}

const symbols: Partial<Record<Category, string>> = {
  All: "✦",
  "Pizza & Burger": "🍔",
  MoMo: "🥟",
  Chowmein: "🍜",
  "Home Foods (Veg)": "🥗",
  "Chicken Special": "🍗",
  Biryani: "🍚",
  "Chicken Biryani": "🍚",
  "Non-Veg Starter": "🍢",
  Beer: "🍺",
  Wine: "🍷",
  "Cold Drinks & Juices": "🥤",
};

const CategoryFilter: React.FC<Props> = ({
  selected,
  onChange,
  categories,
}) => (
  <nav className="category-tabs" aria-label="Menu categories">
    {categories.map((cat) => (
      <button
        key={cat}
        type="button"
        aria-pressed={selected === cat}
        onClick={() => onChange(cat)}
        className={`category-tab ${selected === cat ? "active" : ""}`}
      >
        <span aria-hidden="true">{symbols[cat] || "🍽"}</span>
        {cat === "All" ? "All items" : cat}
      </button>
    ))}
  </nav>
);
export default CategoryFilter;
