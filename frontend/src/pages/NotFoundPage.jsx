import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white text-center">
          404
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-6 text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          It might have been moved or deleted.
        </p>

        {/* Button to navigate back */}
        <Link
          to="/"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Go to Homepage
        </Link>

        {/* Optional: Search bar to find pages */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search for a page..."
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
          Need help?{" "}
          <a
            href="/contact"
            className="text-blue-600 hover:underline dark:text-blue-500"
          >
            Contact Support
          </a>
        </p>
      </div>
    </section>
  );
};

export default NotFoundPage;
