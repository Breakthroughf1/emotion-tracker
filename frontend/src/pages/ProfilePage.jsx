import React, { useState, useEffect } from "react";
import {
  updateProfile,
  deleteAccount,
  fetchEmotionAnalytics,
} from "../services/userService";
import { getCurrentUser } from "../services/authService";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [emotionData, setEmotionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState({
    email: "",
    name: "",
    profilePic: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setEditProfile({
        email: currentUser?.email || "",
        name: currentUser?.name || "",
        profilePic: currentUser?.profilePic || "",
      });

      try {
        const analytics = await fetchEmotionAnalytics(currentUser?.id);
        setEmotionData({
          labels: analytics.emotion_stats.map((stat) => stat.emotion),
          data: analytics.emotion_stats.map((stat) => stat.count),
          dominantEmotion: analytics.dominant_emotion,
          moodBalance: analytics.mood_balance,
          positiveCount: analytics.positive_count,
          negativeCount: analytics.negative_count,
        });
      } catch (error) {
        console.error("Error fetching emotion analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editProfile.name);
      formData.append("email", editProfile.email);
      if (editProfile.profilePic instanceof File) {
        formData.append("profilePic", editProfile.profilePic);
      }
      await updateProfile(formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteAccount(user.id);
        alert("Account deleted successfully!");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Profile
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar: User Options */}
        <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Edit Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                className="block w-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    profilePic: e.target.files[0],
                  })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editProfile.name}
                className="block w-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                onChange={(e) =>
                  setEditProfile({ ...editProfile, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={editProfile.email}
                className="block w-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                onChange={(e) =>
                  setEditProfile({ ...editProfile, email: e.target.value })
                }
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={handleUpdate}
            >
              Update Profile
            </button>
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Right Sidebar: Emotion Analytics */}
        <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Emotion Analytics
          </h2>
          {loading ? (
            <p className="text-gray-700 dark:text-gray-300">Loading chart...</p>
          ) : (
            <div>
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Dominant Emotion:</strong>{" "}
                  {emotionData.dominantEmotion || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Mood Balance:</strong>{" "}
                  {emotionData.moodBalance || "N/A"}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Positive Emotion Count:</strong>{" "}
                  {emotionData.positiveCount || 0}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Negative Emotion Count:</strong>{" "}
                  {emotionData.negativeCount || 0}
                </p>
              </div>
              <div className="h-80">
                <Bar
                  data={{
                    labels: emotionData.labels,
                    datasets: [
                      {
                        label: "Emotion Counts",
                        data: emotionData.data,
                        backgroundColor: [
                          "#4CAF50",
                          "#FF5722",
                          "#FFC107",
                          "#2196F3",
                          "#9E9E9E",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            `${context.label}: ${context.raw} occurrences`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
