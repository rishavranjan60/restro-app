import React, { useEffect, useState } from "react";
import { getFoods, addFood, updateFood, deleteFood } from "../utils/api";

interface Food {
  id: number;
  name: string;
  category: string;
  price: number;
}

const MenuManagement: React.FC = () => {
  const [menu, setMenu] = useState<Food[]>([]);
  const [form, setForm] = useState({ name: "", category: "", price: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await getFoods();
      console.log("✅ Foods fetched:", data);
      setMenu(data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching menu:", err);
      setError("Failed to load menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
    };

    try {
      if (editId !== null) {
        await updateFood(editId, payload);
        setEditId(null);
      } else {
        await addFood(payload);
      }

      setForm({ name: "", category: "", price: "" });
      fetchMenu();
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      setError("Failed to save food item.");
    }
  };

  const handleEdit = (item: Food) => {
    setForm({ name: item.name, category: item.category, price: item.price.toString() });
    setEditId(item.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteFood(id);
        fetchMenu();
      } catch (err) {
        console.error("❌ Error deleting item:", err);
        setError("Failed to delete food item.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🍽 Menu Management</h2>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Food Name"
            className="p-2 rounded text-black"
            required
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="p-2 rounded text-black"
            required
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="p-2 rounded text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded mt-4"
        >
          {editId !== null ? "Update Food" : "Add Food"}
        </button>
      </form>

      {loading && <p>Loading menu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {menu.length === 0 && !loading ? (
        <p>No food items found.</p>
      ) : (
        <div className="space-y-3">
          {menu.map(item => (
            <div key={item.id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p>{item.category} | Rs. {item.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
