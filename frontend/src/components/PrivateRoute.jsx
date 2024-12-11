import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const PrivateRoute = ({ children }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
