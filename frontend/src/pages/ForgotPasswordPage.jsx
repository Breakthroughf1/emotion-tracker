import React, { useState } from "react";
import { requestPasswordReset } from "../services/authService";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await requestPasswordReset({ email });
      setSuccess("Password reset link sent to your email.");
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Enter your email to receive a password reset link
        </p>
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg">
            {success}
          </div>
        )}
        <form onSubmit={handleReset} className="space-y-4">
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          Remember your password?{" "}
          <a
            href="/"
            className="text-blue-600 hover:underline dark:text-blue-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </section>
  );
};

export default ForgetPasswordPage;
