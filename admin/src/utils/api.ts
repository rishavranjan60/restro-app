export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000/api";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("admin-token");
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API Error ${response.status}: ${errorText}`
    );
  }

  return response.json();
};

export const getFoods = async () => {
  const response = await fetch(
    `${API_BASE_URL}/foods`
  );

  return handleResponse(response);
};

export const addFood = async (
  formData: FormData
) => {
  const response = await fetch(
    `${API_BASE_URL}/foods`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
  );

  return handleResponse(response);
};

export const updateFood = async (
  id: string,
  formData: FormData
) => {
  const response = await fetch(
    `${API_BASE_URL}/foods/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData,
    }
  );

  return handleResponse(response);
};

export const deleteFood = async (id: string) => {
  const response = await fetch(
    `${API_BASE_URL}/foods/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

export const getOrders = async () => {
  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

export const authenticateAdmin = async (
  username: string,
  password: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  return handleResponse(response);
};