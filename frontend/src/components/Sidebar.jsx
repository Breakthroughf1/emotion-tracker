import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCogs, FaChartLine, FaQuestionCircle } from "react-icons/fa";

const Sidebar = ({ isAdmin }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 min-h-screen border-gray-200 dark:border-gray-700 shadow-lg pt-16">
      <div className="p-6 pl-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
      </div>
      <ul className="space-y-2">
        {/* Overview Link */}
        <li>
          <NavLink
            to="/"
            isActive={(match, location) =>
              match ||
              location.pathname === "/admin-dashboard" ||
              location.pathname === "/user-dashboard"
            }
            className={({ isActive }) =>
              `block pr-4 pl-20 py-2 text-gray-300 ${
                isActive
                  ? "dark:bg-gray-900 dark:text-white"
                  : "hover:text-blue-600"
              }`
            }
            title="Go to Overview"
          >
            <FaHome className="inline mr-2" />
            Overview
          </NavLink>
        </li>

        {/* Settings Link */}
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block pr-4 pl-20 py-2 text-gray-300 ${
                isActive
                  ? "dark:bg-gray-900 dark:text-white"
                  : "hover:text-blue-600"
              }`
            }
            title="Settings"
          >
            <FaCogs className="inline mr-2" />
            Settings
          </NavLink>
        </li>

        {/* Analytics Link */}
        {isAdmin && (
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `block pr-4 pl-20 py-2 text-gray-300 ${
                  isActive
                    ? "dark:bg-gray-900 dark:text-white"
                    : "hover:text-blue-600"
                }`
              }
              title="Analytics"
            >
              <FaChartLine className="inline mr-2" />
              Analytics
            </NavLink>
          </li>
        )}
        {/* Help Link */}
        <li>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `block pr-4 pl-20 py-2 text-gray-300 ${
                isActive
                  ? "dark:bg-gray-900 dark:text-white"
                  : "hover:text-blue-600"
              }`
            }
            title="Help & Support"
          >
            <FaQuestionCircle className="inline mr-2" />
            Help
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
