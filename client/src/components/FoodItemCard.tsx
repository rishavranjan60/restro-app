import React from "react";
import { FoodItem } from "../types/types";

interface Props {
  item: FoodItem;
  onOrder: (item: FoodItem) => void;
}

const FoodItemCard: React.FC<Props> = ({ item, onOrder }) => (
  <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg mb-4 shadow">
    <div className="flex items-center gap-4">
      <img src={item.image} className="w-20 h-20 rounded" alt={item.name} />
      <div>
        <h4 className="text-lg font-bold">{item.name}</h4>
        <p>QTY: {item.quantity}</p>
        <p>Rs. {item.price}</p>
      </div>
    </div>
    <button
      onClick={() => onOrder(item)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
    >
      Order
    </button>
  </div>
);

export default FoodItemCard;
