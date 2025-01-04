// components/Layout.js
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { getCurrentUser } from "../services/authService";

const Layout = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsAdmin(user.role); // Properly check if the user's role is "admin"
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col">
        <Navbar isAdmin={isAdmin} />
        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
