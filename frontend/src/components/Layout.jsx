// components/Layout.js
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
