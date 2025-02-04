import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserDashboardPage from "./pages/UserDashboardPage";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import { isAuthenticated, getCurrentUser } from "./services/authService";
import HelpPage from "./pages/HelpPage";
import Layout from "./components/Layout";
import AnalyticsPage from "./pages/private/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/public/LoginPage";
import RegistrationPage from "./pages/public/RegisterPage";
import ForgetPasswordPage from "./pages/public/ForgotPasswordPage";
import AdminDashboardPage from "./pages/private/AdminDashboardPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import LoadingSpinner from "./components/LoadingSpinner"; // Add a loading spinner component

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const details = getCurrentUser();
        setUserRole(details?.role ? "admin" : "user");
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <LoadingSpinner />; // Show a loading spinner while checking auth
  }

  console.log(userRole);

  return (
    <Router>
      <Routes>
        {/* Root Route: Redirect to Dashboard */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated()
                  ? userRole === "admin"
                    ? "/admin-dashboard"
                    : "/user-dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        </Route>

        {/* Private Routes for Both Users and Admins */}
        <Route element={<PrivateRoute allowedRoles={["admin", "user"]} />}>
          <Route
            path="/user-dashboard"
            element={
              <Layout>
                <UserDashboardPage />
              </Layout>
            }
          />
          <Route
            path="/help"
            element={
              <Layout>
                <HelpPage />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
        </Route>

        {/* Private Routes for Admins Only */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin-dashboard"
            element={
              <Layout>
                <AdminDashboardPage />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <AnalyticsPage />
              </Layout>
            }
          />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
