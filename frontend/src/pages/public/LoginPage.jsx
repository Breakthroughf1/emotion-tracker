import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token); // Save JWT token
      navigate("/"); // Redirect
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
<section
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url('ai-generated-8612487_1280.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for dark shade */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        style={{
          zIndex: 0, // Place the overlay below the content
        }}
      ></div>
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-800 opacity-85 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Please sign in to continue
        </p>
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            disabled={loading} // Disable button during loading
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          Don’t have an account yet?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline dark:text-blue-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
