import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  name: string;
  phone: string;
  table: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Orders</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {orders.length === 0 && !loading ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-800 p-4 rounded mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">Order #{order._id}</h3>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <p>👤 {order.name} | 📞 {order.phone} | 🪑 Table {order.table}</p>
              <ul className="mt-2 ml-4 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - {item.quantity} × €{item.price}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold">Total: €{order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
