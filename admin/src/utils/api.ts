// src/utils/api.ts

// ✅ Base URL from .env
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Helper: Handle responses safely
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error ${res.status}: ${errText}`);
  }
  return res.json();
};

// ---- Food APIs ----
export const getFoods = async () => {
  const res = await fetch(`${API_BASE_URL}/foods`);
  return handleResponse(res);
};

export const addFood = async (formData: FormData) => {
  const res = await fetch(`${API_BASE_URL}/foods`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
};

export const updateFood = async (id: string, formData: FormData) => {
  const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: "PUT",
    body: formData,
  });
  return handleResponse(res);
};

export const deleteFood = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
};

// ---- Orders APIs ----
export const getOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/orders`);
  return handleResponse(res);
};
