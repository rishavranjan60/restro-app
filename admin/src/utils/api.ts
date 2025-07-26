// admin/utils/api.ts

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://restro-backend-eder.onrender.com/api/foods";

export const getFoods = async () => {
  const res = await fetch(API_BASE_URL, {
    credentials: "include",
  });
  return res.json();
};

export const addFood = async (formData: FormData) => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  return res.json();
};

export const updateFood = async (id: string, formData: FormData) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });
  return res.json();
};

export const deleteFood = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};
