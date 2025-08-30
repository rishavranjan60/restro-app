// src/utils/api.ts

// ✅ Base URL from .env
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// ---- Food APIs ----
export const getFoods = async () => {
  const res = await fetch(`${API_BASE_URL}/foods`);
  return res.json();
};

export const addFood = async (formData: FormData) => {
  const res = await fetch(`${API_BASE_URL}/foods`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};

export const updateFood = async (id: string, formData: FormData) => {
  const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
};

export const deleteFood = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

// ---- Orders APIs ----
export const getOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/orders`);
  return res.json();
};
