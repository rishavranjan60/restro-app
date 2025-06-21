import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      login("mock-token"); // Store token in localStorage
      navigate("/");       // ✅ Redirect to admin dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 w-80 mx-auto mt-32 bg-gray-800 rounded-lg">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 w-full p-2 rounded text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full p-2 rounded text-black"
      />
      <button type="submit" className="w-full bg-blue-500 p-2 rounded">Login</button>
    </form>
  );
};

export default Login;
