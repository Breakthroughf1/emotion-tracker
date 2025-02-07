import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://127.0.0.1:8000";

// Modified storage handling
export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};
// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const registerFaceData = async (userFaceData) => {
  const response = await axios.post(
    `${API_URL}/auth/register/face-data`,
    userFaceData
  );
  return response.data;
};
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data; // Return token without storing it
};

// Request Password Reset (stubbed function)
export const requestPasswordReset = () => {
  return null;
};

export const logoutUser = () => {
  // Clear all possible token storage
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

// Enhanced authentication check
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    const isValid = decodedToken.exp * 1000 > Date.now();
    if (!isValid) logoutUser();
    return isValid;
  } catch (error) {
    logoutUser();
    return false;
  }
};

// Get Current User
export const getCurrentUser = async () => {
  const token = getToken();
  if (!isAuthenticated()) return null;
  try {
    return jwtDecode(token); // Decode token to get user details
  } catch (error) {
    logoutUser();
    console.error("Invalid token:", error);
    return null;
  }
};

// Role-based helper functions
export const userHasRole = (requiredRoles) => {
  const user = getCurrentUser();
  return user && requiredRoles.includes(user.role);
};

// // Async user details fetch
export const getCurrentUserDetails = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/user/get_user_details`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user_details;
  } catch (error) {
    console.error("Error fetching user details:", error);
    logoutUser();
    return null;
  }
};
