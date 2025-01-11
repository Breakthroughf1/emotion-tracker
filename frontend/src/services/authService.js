import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://127.0.0.1:8000";

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

// Login User
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  localStorage.setItem("token", response.data.token); // Save token to local storage
  return response.data;
};

// Request Password Reset (stubbed function)
export const requestPasswordReset = () => {
  return null;
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Get Token from Local Storage
export const getToken = () => localStorage.getItem("token");

// Check if the User is Authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now(); // Token is valid if not expired
  } catch (error) {
    localStorage.removeItem("token");
    console.error("Invalid token:", error);
    return false;
  }
};

// Get Current User
export const getCurrentUser = () => {
  const token = getToken();
  if (!isAuthenticated()) return null;
  try {
    return jwtDecode(token); // Decode token to get user details
  } catch (error) {
    localStorage.removeItem("token");
    console.error("Invalid token:", error);
    return null;
  }
};
// Get Current User Details
export const getCurrentUserDetails = async () => {
  const token = getToken();
  if (!isAuthenticated()) return null;
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(`${API_URL}/user/get_user_details`, {
      ...config,
    });
    return response.data.user_details;
  } catch (error) {
    console.error("Error fetching user data from server:", error);
    return null;
  }
};
