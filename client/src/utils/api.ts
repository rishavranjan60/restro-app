// ✅ Use backend URL from .env
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

export const placeOrder = async (order: any) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(`Order failed: ${errMsg}`);
  }

  return res.json();
};
