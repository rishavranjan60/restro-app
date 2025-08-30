import React, { useEffect, useState } from "react";
import { getFoods, addFood, updateFood, deleteFood } from "../utils/api";

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
  const [loading, setLoading] = useState(false);

  const fetchFoods = async () => {
    try {
      const data = await getFoods();
      setFoods(data);
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
      setLoading(true);

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
        await updateFood(editingId, foodForm);
        setEditingId(null);
      } else {
        await addFood(foodForm);
      }

      fetchFoods();
      resetForm();
    } catch (err) {
      console.error("❌ Error saving food item:", err);
      alert("Failed to save food item");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (food: FoodItem) => {
    setForm(food);
    setEditingId(food._id || null);
    setImageFile(null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteFood(id);
      fetchFoods();
    } catch (err) {
      console.error("❌ Error deleting food item:", err);
      alert("Failed to delete food item");
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
            placeholder="Price (EUR)"
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
          <input
            className="p-2 rounded text-black col-span-1 md:col-span-2"
            name="eta"
            value={form.eta}
            onChange={handleChange}
            placeholder="ETA (e.g. 15 min)"
            required
          />
          <textarea
            className="p-2 rounded text-black col-span-1 md:col-span-2"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
        </div>
        <div className="mt-4 flex gap-3 items-center">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : editingId ? "Update" : "Submit"}
          </button>
          <button
            onClick={resetForm}
            className={`px-4 py-2 rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"
            }`}
            disabled={loading}
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
                <td className="p-2">EUR {food.price}</td>
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
