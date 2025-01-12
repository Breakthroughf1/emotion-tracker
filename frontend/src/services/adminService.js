// ./services/adminServices.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/admin";

export const getEmotion = async () => {
  const token = localStorage.getItem("token");
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
