// emotionService.js
import axios from "axios";
import { getToken, isAuthenticated } from "./authService";

const API_URL = "http://127.0.0.1:8000/user";

export const addEmotion = async (emotionData) => {
  const response = await axios.post(`${API_URL}/add_emotion`, emotionData);
  return response.data;
};
export const getEmotion = async (user_id) => {
  const response = await axios.get(`${API_URL}/get_emotion?user_id=${user_id}`);
  return response.data;
};
export const getProfile = async (user_id) => {
  const response = await axios.get(`${API_URL}/get_emotion?user_id=${user_id}`);
  return response.data;
};
export const fetchEmotionAnalytics = async (user_id) => {
  const response = await axios.get(
    `${API_URL}/get_emotion_stats?user_id=${user_id}`
  );
  return response.data;
};
export const updateProfile = async (formData) => {
  const token = getToken();

  if (!isAuthenticated()) return null; // If not authenticated, return null

  try {
    const response = await axios.post(`${API_URL}/update_profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Correct header format
        "Content-Type": "multipart/form-data", // Assuming you're sending files
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};
export const deleteAccount = async (email) => {
  try {
    // Ensure the email is URL-encoded
    const response = await axios.delete(`${API_URL}/delete`, {
      params: { email: email },
    });
    return response.data.message;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error deleting account:", error.message);
    throw new Error("Failed to delete account. Please try again.");
  }
};
