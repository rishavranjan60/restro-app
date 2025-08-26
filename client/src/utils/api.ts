// ✅ Change this once your ECS Load Balancer URL is ready
export const API_BASE_URL = "https://http://alb-1234.us-east-1.elb.amazonaws.com/api";

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
