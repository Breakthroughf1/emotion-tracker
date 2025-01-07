// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserDashboardPage from "./pages/UserDashboardPage";

import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import { getCurrentUser } from "./services/authService";
import HelpPage from "./pages/HelpPage";
import Layout from "./components/Layout"; // Import the Layout component
import AnalyticsPage from "./pages/private/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/public/LoginPage";
import RegistrationPage from "./pages/public/RegisterPage";
import ForgetPasswordPage from "./pages/public/ForgotPasswordPage";
import AdminDashboardPage from "./pages/private/AdminDashboardPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import SettingsPage from "./pages/public/SettingsPage";

const App = () => {
  const getDashboardRoute = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return "/login"; // Redirect unauthenticated users to login
    return currentUser.role ? "/admin-dashboard" : "/user-dashboard";
  };

  return (
    <Router>
      <Routes>
        {/* Root Route: Redirect to Dashboard */}
        <Route
          path="/"
          element={<Navigate to={getDashboardRoute()} replace />}
        />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        </Route>

        {/* Private Routes for both User and Admin */}
        <Route element={<PrivateRoute allowedRoles={[false, true]} />}>
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
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />
        </Route>

        {/* Private Route for Admin */}
        <Route element={<PrivateRoute allowedRoles={[true]} />}>
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

        {/* Default Route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
