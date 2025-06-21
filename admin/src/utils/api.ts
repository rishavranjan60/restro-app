const API = "http://localhost:5000/api/foods";

export const getFoods = async () => {
  const res = await fetch(API);
  return res.json();
};

export const addFood = async (food: { name: string; category: string; price: number }) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(food),
  });
  return res.json();
};

export const updateFood = async (id: number, food: { name: string; category: string; price: number }) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(food),
  });
  return res.json();
};

export const deleteFood = async (id: number) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
