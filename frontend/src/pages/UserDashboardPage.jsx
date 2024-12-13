import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const UserDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content Area with Sidebar and Dashboard */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        
        {/* User Dashboard */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Your Dashboard
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Quick summary of your account.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your preferences.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                View usage statistics and insights.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardPage;
