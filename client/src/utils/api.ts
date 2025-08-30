// client/src/utils/api.ts

//  Use backend URL from .env (CRA requires REACT_APP_ prefix)
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

//  Helper: centralized error handling
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error ${res.status}: ${errText}`);
  }
  return res.json();
};

//  Fetch foods (menu items)
export const getFoods = async () => {
  const res = await fetch(`${API_BASE_URL}/foods`);
  return handleResponse(res);
};

//  Place new order
export const placeOrder = async (order: any) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return handleResponse(res);
};
