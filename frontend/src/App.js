import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgotPasswordPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Mock function to get user role 
const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null; // Not logged in
  return user.role; // Either 'user' or 'admin'
};

// Wrapper route for handling root redirection
const RootRedirect = () => {
  const role = getUserRole();
  
  if (!role) return <Navigate to="/login" replace />; // Redirect to login if not logged in
  
  // Redirect to appropriate dashboard based on role
  return role === "admin" ? (
    <Navigate to="/admin-dashboard" replace />
  ) : (
    <Navigate to="/user-dashboard" replace />
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Root route based on user role */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />

        {/* Private routes */}
        <Route
          path="/user-dashboard"
          element={
            getUserRole() === "user" ? <UserDashboardPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            getUserRole() === "admin" ? <AdminDashboardPage /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
