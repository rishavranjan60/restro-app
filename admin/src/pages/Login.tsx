import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authenticateAdmin } from "../utils/api";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await authenticateAdmin(
        username,
        password
      );

      login(result.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-6 w-80 mx-auto mt-32 bg-gray-800 rounded-lg"
    >
      <h1 className="text-2xl font-bold mb-6">
        Admin Login
      </h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(event) =>
          setUsername(event.target.value)
        }
        className="mb-4 w-full p-2 rounded text-black"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        className="mb-4 w-full p-2 rounded text-black"
        required
      />

      {error && (
        <p className="mb-4 text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 p-2 rounded disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;