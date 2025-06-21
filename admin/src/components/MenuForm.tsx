import React, { useEffect, useState } from "react";
import axios from "axios";

interface FoodItem {
  _id?: string;
  name: string;
  quantity: string;
  price: number;
  category: string;
  type: "Veg" | "Non-Veg";
  eta: string;
  image?: string;
  description: string;
}

const categories = [
  "MoMo",
  "Chowmeine",
  "Beer",
  "Chicken Biryani",
  "Drinks",
  "Snacks",
  "Dessert",
];

const MenuForm: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [form, setForm] = useState<FoodItem>({
    name: "",
    quantity: "",
    price: 0,
    category: "",
    type: "Veg",
    eta: "",
    image: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchFoods = async () => {
    const res = await axios.get("http://localhost:5000/api/foods");
    setFoods(res.data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = form.image;

      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload", uploadForm);
        imageUrl = uploadRes.data.url;
      }

      const foodData = {
        ...form,
        image: imageUrl,
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/foods/${editingId}`, foodData);
      } else {
        await axios.post("http://localhost:5000/api/foods", foodData);
      }

      fetchFoods();
      resetForm();
    } catch (err) {
      console.error("❌ Error saving food item:", err);
    }
  };

  const handleEdit = (food: FoodItem) => {
    setForm(food);
    setEditingId(food._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await axios.delete(`http://localhost:5000/api/foods/${id}`);
    fetchFoods();
  };

  const resetForm = () => {
    setForm({
      name: "",
      quantity: "",
      price: 0,
      category: "",
      type: "Veg",
      eta: "",
      image: "",
      description: "",
    });
    setImageFile(null);
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Manage Menu</h2>

      {/* FORM */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="p-2 rounded text-black"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Food Name"
          />

          <select
            className="p-2 rounded text-black"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
          >
            <option value="">Select Quantity</option>
            <option value="Full">Full</option>
            <option value="Half">Half</option>
          </select>

          <input
            className="p-2 rounded text-black"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (Rs)"
          />

          <select
            className="p-2 rounded text-black"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="p-2 rounded text-black"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>

          <input
            className="p-2 rounded text-black"
            name="eta"
            value={form.eta}
            onChange={handleChange}
            placeholder="ETA (e.g. 15 min)"
          />

          <input
            className="p-2 bg-white text-black rounded"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <textarea
            className="p-2 rounded text-black col-span-1 md:col-span-2"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Submit"}
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Type</th>
              <th className="p-2">ETA</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id} className="border-b border-gray-700">
                <td className="p-2">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-2">{food.name}</td>
                <td className="p-2">{food.quantity}</td>
                <td className="p-2">Rs. {food.price}</td>
                <td className="p-2">{food.category}</td>
                <td className="p-2">{food.type}</td>
                <td className="p-2">{food.eta}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(food)}
                    className="bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuForm;