// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgotPasswordPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import { getCurrentUser } from "./services/authService";
import HelpPage from "./pages/HelpPage";
import Layout from "./components/Layout"; // Import the Layout component
import AnalyticsPage from "./pages/AnalyticsPage";

const App = () => {
  const getDashboardRoute = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return "/login"; // Redirect unauthenticated users to login
    return currentUser.role ? "/dashboard-admin" : "/dashboard-user";
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
            path="/dashboard-user"
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
            path="/analytics"
            element={
              <Layout>
                <AnalyticsPage />
              </Layout>
            }
          />
        </Route>

        {/* Private Route for Admin */}
        <Route element={<PrivateRoute allowedRoles={[true]} />}>
          <Route
            path="/dashboard-admin"
            element={
              <Layout>
                <AdminDashboardPage />
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
