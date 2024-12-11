import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const PublicRoute = ({ children }) => {
  const user = getCurrentUser();
  if (user) {
    // Redirect based on role or user type
    return user.isAdmin ? <Navigate to="/admin-dashboard" /> : <Navigate to="/user-dashboard" />;
  }
  return children;
};

export default PublicRoute;
