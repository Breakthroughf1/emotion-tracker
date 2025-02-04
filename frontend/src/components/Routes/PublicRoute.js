import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
