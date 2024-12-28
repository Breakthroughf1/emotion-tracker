import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getEmotion } from "../services/adminService";

const AdminDashboardPage = () => {
  const [emotionData, setEmotionData] = useState([]);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const data = await getEmotion();
        setEmotionData(data.data);
      } catch (error) {
        console.error("Failed to fetch emotions:", error);
      }
    };
    fetchEmotions();
  }, []);

  return (
    <div className="max-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Admin Dashboard
          </h1>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Emotion History by Users
            </h2>
            {emotionData.map((user) => (
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
                          {record.emotion}
                        </td>
                        <td className="border-b dark:border-gray-700 p-4">
                          {record.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            {emotionData.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                No emotions recorded yet.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
