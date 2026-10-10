import React from "react";
import MenuIcon from "./MenuIcon";
import { CartItem } from "../types/types";
import { formatPrice } from "./FoodItemCard";

export const cartItemKey = (item: CartItem) =>
  `${item._id || item.id}:${item.quantity}`;
interface Props {
  cart: CartItem[];
  onIncrement: (key: string) => void;
  onDecrement: (key: string) => void;
  onClear: () => void;
  disabled?: boolean;
}
const Cart: React.FC<Props> = ({
  cart,
  onIncrement,
  onDecrement,
  onClear,
  disabled,
}) => (
  <div className="cart-content">
    {cart.length === 0 ? (
      <div className="empty-cart">
        <span>
          <MenuIcon name="bag" size={30} />
        </span>
        <h3>Good food is one tap away.</h3>
        <p>Add your favourites from the menu to get started.</p>
      </div>
    ) : (
      <>
        <div className="cart-list">
          {cart.map((item) => {
            const key = cartItemKey(item);
            return (
              <div key={key} className="cart-line">
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.quantity} portion · {formatPrice(item.price)}
                  </p>
                  <div className="quantity-control">
                    <button
                      type="button"
                      disabled={disabled}
                      aria-label={`Remove one ${item.name}, ${item.quantity.toLowerCase()} portion`}
                      onClick={() => onDecrement(key)}
                    >
                      −
                    </button>
                    <span aria-label="Quantity">{item.cartQuantity}</span>
                    <button
                      type="button"
                      disabled={disabled}
                      aria-label={`Add one ${item.name}, ${item.quantity.toLowerCase()} portion`}
                      onClick={() => onIncrement(key)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <strong>{formatPrice(item.price * item.cartQuantity)}</strong>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="clear-cart"
          disabled={disabled}
          onClick={onClear}
        >
          Clear order
        </button>
      </>
    )}
  </div>
);
export default Cart;
