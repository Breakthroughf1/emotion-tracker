// ./services/adminServices.js
import axios from "axios";
import { getToken } from "./authService";

const API_URL = "http://127.0.0.1:8000/admin";

export const getEmotion = async () => {
  const token = getToken();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/get_all_emotion`, config);
  return response.data;
};
// Fetch emotion stats
export const getEmotionStats = async () => {
  const response = await axios.get(`${API_URL}/get_emotion_stats`, {});
  return response.data;
};
// Delete a specific user's emotion record
export const deleteUserEmotion = async (userId, timestamp) => {
  const token = getToken();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.delete(
    `${API_URL}/delete_emotion/${userId}/${timestamp}`,
    config
  );
};

// Clear all emotion records
export const clearAllEmotions = async () => {
  const token = getToken();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.delete(`${API_URL}/clear_all_emotions`, config);
};
