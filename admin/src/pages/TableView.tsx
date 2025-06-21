import React from "react";

const TableView: React.FC = () => {
  const tables = [
    { number: 1, status: "Occupied", orderId: 2 },
    { number: 2, status: "Free", orderId: null },
    { number: 3, status: "Occupied", orderId: 5 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🪑 Table Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map(table => (
          <div key={table.number} className={`p-4 rounded shadow ${table.status === "Free" ? "bg-green-700" : "bg-yellow-600"}`}>
            <h3 className="text-lg font-bold">Table {table.number}</h3>
            <p>Status: {table.status}</p>
            {table.orderId && <p>Order ID: #{table.orderId}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableView;
