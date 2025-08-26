// ✅ Use ECS Load Balancer DNS URL once deployed
const API_BASE_URL = "https://http://alb-1234.us-east-1.elb.amazonaws.com/api/foods";

export const getFoods = async () => {
  const res = await fetch(API_BASE_URL, { credentials: "include" });
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
