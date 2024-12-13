// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgotPasswordPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute allowedRoles={[false]} />}>
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={[true]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* Default Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
