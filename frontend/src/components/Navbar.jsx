import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { logoutUser } from "../services/authService";

const Navbar = ({ isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    try {
      logoutUser();
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdminToggle = () => {
    if (location.pathname === "/dashboard-admin") {
      navigate("/dashboard-user"); // Redirect to user dashboard
    } else {
      navigate("/dashboard-admin"); // Redirect to admin dashboard
    }
  };

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
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
          >
            Logout
          </button>
          {isAdmin && (
            <button
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
              onClick={handleAdminToggle}
            >
              {location.pathname === "/dashboard-admin"
                ? "View as Member"
                : "Go to Admin Dashboard"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
