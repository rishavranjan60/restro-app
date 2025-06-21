import React, { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  name: string;
  phone: string;
  table: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📦 Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="bg-gray-800 p-4 rounded mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold">Order #{order.id} - {order.name}</h3>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <p>📞 {order.phone} | 🪑 Table {order.table}</p>
          <ul className="mt-2 ml-4 list-disc">
            {order.items.map((item, idx) => (
              <li key={idx}>{item.name} - {item.quantity} × Rs. {item.price}</li>
            ))}
          </ul>
          <p className="mt-2 font-semibold">Total: Rs. {order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
