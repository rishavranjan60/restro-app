import React, { useEffect, useState } from "react";
import axios from "axios";
import { CartItem, Category, FoodItem } from "../types/types";
import CategoryFilter from "../components/CategoryFilter";
import Cart from "../components/Cart";
import BillDownload from "../components/BillDownload";
import { placeOrder } from "../utils/api";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";


const Home: React.FC = () => {
  const [category, setCategory] = useState<Category>("All");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState("");
  const [quantitySelection, setQuantitySelection] = useState<Record<string, "Full" | "Half">>({});

  useEffect(() => {
  const fetchFoods = async () => {
    try {
      const res = await axios.get<FoodItem[]>(`${API_BASE_URL}/foods`);
      setFoodItems(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch foods", err);
    }
  };
  fetchFoods();
}, []);

  const filtered = category === "All"
    ? foodItems
    : foodItems.filter(f => f.category === category);

  const addToCart = (item: FoodItem) => {
    const id = item._id || item.id!;
    const selectedQuantity = quantitySelection[id] || "Full";
    const price = selectedQuantity === "Full" ? item.price : item.price / 2;

    const existing = cart.find(p => (p._id === id || p.id === id) && p.quantity === selectedQuantity);

    if (existing) {
      setCart(prev =>
        prev.map(p =>
          (p._id === id || p.id === id) && p.quantity === selectedQuantity
            ? { ...p, cartQuantity: p.cartQuantity + 1 }
            : p
        )
      );
    } else {
      setCart(prev => [
        ...prev,
        { ...item, cartQuantity: 1, price, quantity: selectedQuantity },
      ]);
    }
  };

  const increment = (id: number | string) => {
    setCart(prev =>
      prev.map(p =>
        p._id === id || p.id === id
          ? { ...p, cartQuantity: p.cartQuantity + 1 }
          : p
      )
    );
  };

  const decrement = (id: number | string) => {
    setCart(prev =>
      prev
        .map(p =>
          p._id === id || p.id === id
            ? { ...p, cartQuantity: p.cartQuantity - 1 }
            : p
        )
        .filter(p => p.cartQuantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setOrderPlaced(false);
    setName("");
    setPhone("");
    setTable("");
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );

  const confirmOrder = async () => {
    if (!name || !phone || !table) {
      alert("Please fill in all customer details.");
      return;
    }

    try {
      const orderData = {
        name,
        phone,
        table,
        items: cart.map(i => ({
          name: i.name,
          quantity: i.cartQuantity,
          price: i.price,
        })),
        total,
      };

      await placeOrder(orderData);
      setOrderPlaced(true);
      alert("✅ Order placed successfully!");
    } catch (err) {
      alert("❌ Failed to place order.");
      console.error(err);
    }
  };

  return (
    <div className="md:flex bg-[#0d0d1d] text-white min-h-screen">
      {/* Left - Food Items */}
      <div className="md:w-2/3 w-full p-4 overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-bold mb-2">Restro Menu</h1>
        <CategoryFilter selected={category} onChange={setCategory} />

        <div className="space-y-4 mt-4">
          {filtered.map(item => {
            const id = item._id || item.id!;
            const selected = quantitySelection[id] || "Full";
            return (
              <div
                key={id}
                className="flex justify-between items-center bg-zinc-800 p-4 rounded shadow-md"
              >
                {/* Left - Image */}
                <div className="w-16 h-16 rounded overflow-hidden bg-white">
                  <img
                    src={item.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Center - Info */}
                <div className="flex-1 mx-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-300">ETA: {item.eta || "10-15 mins"}</p>
                </div>

                {/* Right - Select + Order */}
                <div className="flex items-center gap-2">
                  <select
                    className="p-2 rounded text-black"
                    value={selected}
                    onChange={(e) =>
                      setQuantitySelection(prev => ({
                        ...prev,
                        [id]: e.target.value as "Full" | "Half",
                      }))
                    }
                  >
                    <option value="Half">Half - Rs. {item.price / 2}</option>
                    <option value="Full">Full - Rs. {item.price}</option>
                  </select>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right - Cart & Order */}
      <div className="md:w-1/3 w-full bg-[#111827] p-4 border-t md:border-l md:border-t-0 border-gray-600">
        {!orderPlaced ? (
          <>
            <Cart
              cart={cart}
              onIncrement={increment}
              onDecrement={decrement}
              onConfirm={confirmOrder}
              onClear={clearCart}
            />

            <p className="mt-4 text-lg font-bold">Total: EURO: {total}</p>

            <div className="mt-4 bg-gray-700 p-3 rounded-md">
              <h3 className="text-lg font-medium mb-2">🧾 Customer Details</h3>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 mb-2 text-black rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 mb-2 text-black rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Table Number"
                className="w-full p-2 mb-2 text-black rounded"
                value={table}
                onChange={(e) => setTable(e.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-3">
              <button
                onClick={confirmOrder}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                ✅ Confirm Order
              </button>
              <button
                onClick={clearCart}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                ❌ Clear Cart
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-2xl font-semibold mt-6 text-green-400">
              ✅ Order placed
            </div>
            <BillDownload cart={cart} total={total} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
