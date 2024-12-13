// components/Routes/PublicRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";

const PublicRoute = () => {
  const currentUser = getCurrentUser(); // Get the current user

  if (currentUser) {
    // Redirect authenticated users to the appropriate dashboard
    return currentUser.role ? (
      <Navigate to="/admin-dashboard" replace />
    ) : (
      <Navigate to="/user-dashboard" replace />
    );
  }

  // Render nested routes for unauthenticated users
  return <Outlet />;
};

export default PublicRoute;
