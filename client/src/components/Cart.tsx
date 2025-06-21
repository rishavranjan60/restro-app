import React from "react";
import { CartItem } from "../types/types";

interface Props {
  cart: CartItem[];
  onIncrement: (id: number | string) => void;
  onDecrement: (id: number | string) => void;
  onConfirm: () => void;
  onClear: () => void;
}

const Cart: React.FC<Props> = ({ cart, onIncrement, onDecrement, onConfirm, onClear }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  return (
    <div className="bg-zinc-800 p-4 mt-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">🛒 Cart Items</h2>

      {cart.length === 0 && <p>No items in cart.</p>}

      {cart.map((item) => {
        const id = item._id || item.id!;

        return (
          <div key={id} className="flex justify-between py-2 items-center border-b border-zinc-700">
            <div>
              {item.name} - Rs. {item.price} x {item.cartQuantity} = Rs.{" "}
              {item.price * item.cartQuantity}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDecrement(id)}
                className="px-2 bg-gray-500 rounded"
              >
                −
              </button>
              <button
                onClick={() => onIncrement(id)}
                className="px-2 bg-gray-500 rounded"
              >
                +
              </button>
            </div>
          </div>
        );
      })}

      {cart.length > 0 && (
        <>
          <p className="mt-4 text-lg font-bold">Total: Rs. {total}</p>
          <div className="mt-2 flex gap-4">
            <button
              onClick={onConfirm}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Confirm Order
            </button>
            <button
              onClick={onClear}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
