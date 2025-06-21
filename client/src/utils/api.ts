export const placeOrder = async (order: any) => {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
  
    if (!res.ok) {
      throw new Error("Order failed");
    }
  
    return res.json();
  };
  