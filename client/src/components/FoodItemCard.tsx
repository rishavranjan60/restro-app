import React, { useState } from "react";
import { FoodItem } from "../types/types";

interface Props {
  item: FoodItem;
  onOrder: (item: FoodItem) => void;
  portion: "Full" | "Half";
  disabled?: boolean;
  onPortionChange: (portion: "Full" | "Half") => void;
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(price);

const FoodItemCard: React.FC<Props> = ({
  item,
  onOrder,
  portion,
  onPortionChange,
  disabled,
}) => {
  const [failedImage, setFailedImage] = useState<string>();
  const price = portion === "Half" ? item.price / 2 : item.price;
  const fallback = !item.image || failedImage === item.image;
  return (
    <article className="food-card">
      <div className={`food-image ${fallback ? "illustrated" : ""}`}>
        {fallback ? (
          <div className="food-placeholder">
            <span aria-hidden="true">🍽</span>
            <span>Made to order</span>
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={() => setFailedImage(item.image)}
          />
        )}
        <span
          className={`diet-label ${item.type === "Veg" ? "veg" : "non-veg"}`}
        >
          <i />
          {item.type}
        </span>
      </div>
      <div className="food-card-body">
        <p className="food-category">{item.category}</p>
        <h3>{item.name}</h3>
        <p className="food-description">
          {item.description || "Freshly prepared, ready for your table."}
        </p>
        <div className="portion-row">
          <span className="prep-time">◷ {item.eta || "10–15 min"}</span>
          <select
            disabled={disabled}
            aria-label={`Portion for ${item.name}`}
            value={portion}
            onChange={(e) => onPortionChange(e.target.value as "Full" | "Half")}
          >
            <option value="Full">Full portion</option>
            <option value="Half">Half portion</option>
          </select>
        </div>
        <div className="food-card-bottom">
          <strong>{formatPrice(price)}</strong>
          <button
            type="button"
            disabled={disabled}
            className="add-button"
            onClick={() => onOrder(item)}
            aria-label={`Add ${item.name}, ${portion.toLowerCase()} portion`}
          >
            Add <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  );
};
export default FoodItemCard;
