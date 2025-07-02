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

// ✅ Set API base URL from env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log("API_BASE_URL is:", API_BASE_URL);


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
    try {
      const res = await axios.get(`${API_BASE_URL}/foods`);
      setFoods(res.data);
    } catch (err) {
      console.error("❌ Error fetching foods:", err);
    }
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

      // 👉 ADD THIS LOG FIRST
    console.log("✅ FormData debug:", {
      name: form.name,
      quantity: form.quantity,
      price: form.price,
      category: form.category,
      type: form.type,
      eta: form.eta,
      description: form.description,
      imageFile,
    });


    
      const foodForm = new FormData();
      foodForm.append("name", form.name);
      foodForm.append("quantity", form.quantity);
      foodForm.append("price", form.price.toString());
      foodForm.append("category", form.category);
      foodForm.append("type", form.type);
      foodForm.append("eta", form.eta);
      foodForm.append("description", form.description);

      if (imageFile) {
        foodForm.append("image", imageFile);
      }

      if (editingId) {
        await axios.put(`${API_BASE_URL}/foods/${editingId}`, foodForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_BASE_URL}/foods`, foodForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
    setImageFile(null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`${API_BASE_URL}/foods/${id}`);
      fetchFoods();
    } catch (err) {
      console.error("❌ Error deleting food item:", err);
    }
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
      <h2 className="text-2xl font-bold mb-4">Manage Menu</h2>

      {/* FORM */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="p-2 rounded text-black"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Food Name"
            required
          />

          <select
            className="p-2 rounded text-black"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
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
            placeholder="Price (EURO)"
            required
          />

          <select
            className="p-2 rounded text-black"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
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
            required
          />

          <input
            className="p-2 bg-white text-black rounded"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded mt-2"
            />
          )}

          <textarea
            className="p-2 rounded text-black col-span-1 md:col-span-2"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
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
                <td className="p-2">EURO: {food.price}</td>
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
