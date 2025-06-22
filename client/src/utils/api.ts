const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const placeOrder = async (order: any) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error("Order failed");
  }

  return res.json();
};
