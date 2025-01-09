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
export const getEmotionStats = async (startDate, endDate) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/get_emotion_stats`, {
    ...config,
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
};

// Fetch emotion trends (time-based)
export const getEmotionTrends = async (userId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL}/get_emotion_trends`, {
    ...config,
    params: { user_id: userId },
  });
  return response.data;
};
