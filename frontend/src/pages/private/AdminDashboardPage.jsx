import React, { useState, useEffect } from "react";
import {
  getEmotion,
  deleteUserEmotion,
  clearAllEmotions,
} from "../../services/adminService";

const EMOTION_EMOJIS = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  disgusted: "🤢",
  neutral: "😐",
  fearful: "😨",
};

const AdminDashboardPage = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      const response = await getEmotion();
      setEmotionData(response.data);
    } catch (err) {
      console.error("Failed to fetch emotions:", err);
      setError("Unable to fetch emotion data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmotion = async (userId, timestamp) => {
    try {
      await deleteUserEmotion(userId, timestamp);
      fetchEmotions();
    } catch (err) {
      console.error("Failed to delete emotion record:", err);
    }
  };

  const handleClearAllEmotions = async () => {
    try {
      await clearAllEmotions();
      fetchEmotions();
    } catch (err) {
      console.error("Failed to clear all emotion records:", err);
    }
  };

  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Dashboard
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Emotion History by Users
        </h2>
        <button
          onClick={handleClearAllEmotions}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4"
        >
          Clear All Emotion Records
        </button>
        {loading ? (
          <div className="animate-pulse">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="mb-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>
        ) : emotionData.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            No emotions recorded yet.
          </p>
        ) : (
          emotionData.map((user) => (
            <div key={user.user_id} className="mb-6">
              <h3 className="text-md font-bold text-gray-700 dark:text-gray-300">
                User ID: {user.user_id} | Email: {user.email}
              </h3>
              <table className="w-full text-left border-collapse dark:text-white mt-4">
                <thead>
                  <tr>
                    <th className="border-b dark:border-gray-700 p-4">
                      Emotion
                    </th>
                    <th className="border-b dark:border-gray-700 p-4">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.emotions.map((record, index) => (
                    <tr key={index}>
                      <td className="border-b dark:border-gray-700 p-4">
                        {EMOTION_EMOJIS[record.emotion] || "❓"}{" "}
                        {record.emotion}
                      </td>
                      <td className="border-b dark:border-gray-700 p-4">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="border-b dark:border-gray-700 p-4">
                        <button
                          onClick={() =>
                            handleDeleteEmotion(user.user_id, record.timestamp)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default AdminDashboardPage;
