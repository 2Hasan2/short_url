import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../context/hooks/useAuthActions";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("hasan@gmail.com");
  const navigate = useNavigate();
  const [password, setPassword] = useState("hasan2004");
  const { login, loading, error, user } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <form
      id="loginForm"
      name="loginForm"
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8"
    >
      <h1 className="text-2xl">Login</h1>
      {error && <h6 className="text-sm text-center text-red-500">{error}</h6>}
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">
          Email
          <input
            type="email"
            id="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1">
          Password
          <input
            type="password"
            id="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </label>
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
