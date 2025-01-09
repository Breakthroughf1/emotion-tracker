// emotionService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/user";

export const addEmotion = async (emotionData) => {
  const response = await axios.post(`${API_URL}/add_emotion`, emotionData);
  return response.data;
};
export const getEmotion = async (user_id) => {
  const response = await axios.get(`${API_URL}/get_emotion?user_id=${user_id}`);
  return response.data;
};
export const fetchEmotionAnalytics = async (user_id) => {
  const response = await axios.get(
    `${API_URL}/get_emotion_trends?user_id=${user_id}`
  );
  return response.data;
};
export const updateProfile = async (user_id) => {
  const response = await axios.get(`${API_URL}/get_emotion?user_id=${user_id}`);
  return response.data;
};
export const deleteAccount = async (user_id) => {
  const response = await axios.get(`${API_URL}/get_emotion?user_id=${user_id}`);
  return response.data;
};
