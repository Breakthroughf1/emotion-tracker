// components/Routes/PrivateRoute.js
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../../services/authService";
import LoadingSpinner from "../LoadingSpinner";

const PrivateRoute = ({ allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        const userDetails = getCurrentUser();
        const userRole = userDetails?.role ? "admin" : "user";
        const authorized = authenticated && allowedRoles.includes(userRole);
        setIsAuthorized(authorized);
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [location, allowedRoles]);
  if (isLoading) return <LoadingSpinner />;

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};
export default PrivateRoute;
