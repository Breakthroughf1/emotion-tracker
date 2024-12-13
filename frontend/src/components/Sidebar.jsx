import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
      </div>
      <ul className="space-y-2">
        <li>
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Settings
          </Link>
        </li>
        <li>
          <Link
            to="/analytics"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Analytics
          </Link>
        </li>
        <li>
          <Link
            to="/help"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Help
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
