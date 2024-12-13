import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow">
      <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center h-16">
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          EmotionTracker
        </Link>
        <div className="flex space-x-4">
          <Link
            to="/profile"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
          >
            Profile
          </Link>
          <Link
            to="/logout"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
