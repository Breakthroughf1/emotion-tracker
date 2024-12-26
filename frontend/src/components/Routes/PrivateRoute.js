// components/Routes/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";

const PrivateRoute = ({ allowedRoles }) => {
  const currentUser = getCurrentUser(); // Get the current user

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  const userRole = currentUser.role; // Boolean: true (admin), false (user)

  if (!allowedRoles.includes(userRole)) {
    // Redirect unauthorized users based on their role
    return <Navigate to="/user-dashboard" replace />;
  }

  // Render nested routes if authenticated and authorized
  return <Outlet />;
};

export default PrivateRoute;
