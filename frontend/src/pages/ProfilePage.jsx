import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaCamera } from "react-icons/fa";
import {
  updateProfile,
  deleteAccount,
  fetchEmotionAnalytics,
} from "../services/userService";
import { getCurrentUserDetails } from "../services/authService";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Modal styles
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(10px)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    background: "#1F2937", // Tailwind's dark-gray
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "400px",
  },
};

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [emotionData, setEmotionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState({
    id: "",
    email: "",
    name: "",
    profilePic: "",
    isEditing: false,
  });
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUserDetails();
        setUser(currentUser);
        setEditProfile({
          id: currentUser?.id || "",
          email: currentUser?.email || "",
          name: currentUser?.name || "",
          profilePic: currentUser?.face_data_path || "",
        });

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
        console.error("Error fetching user data or emotion analytics:", error);
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
      setEditProfile({ ...editProfile, isEditing: false });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteAccount(user.id);
        alert("Account deleted successfully!");
        // Redirect user or take other necessary actions here
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  const closeModal = () => setIsOpen(false);

  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Profile
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar: Edit Profile */}
        <div className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Edit Profile
          </h2>
          <div className="space-y-6">
            {/* Profile Image Section */}
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={
                  editProfile.profilePic instanceof File
                    ? URL.createObjectURL(editProfile.profilePic)
                    : editProfile.profilePic || "/default-profile.png"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border border-gray-300"
              />
              <button
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
                onClick={() => setIsOpen(true)}
              >
                <FaCamera />
              </button>
            </div>
            {/* Modal for updating profile picture */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={modalStyles}
              ariaHideApp={false}
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Update Profile Picture
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    profilePic: e.target.files[0],
                  })
                }
              />
              <div className="flex justify-between mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={closeModal}
                >
                  Save
                </button>
              </div>
            </Modal>

            {/* Name and Email Fields */}
            <div>
              <label className="block text-gray-700 dark:text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editProfile.name}
                className="block w-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border rounded-lg px-4 py-2"
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
                className="block w-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border rounded-lg px-4 py-2"
                onChange={(e) =>
                  setEditProfile({ ...editProfile, email: e.target.value })
                }
              />
            </div>
            {/* Action Buttons */}
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={handleUpdate}
            >
              Update Profile
            </button>
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-2"
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
            <p className="text-gray-700 dark:text-gray-300">Loading...</p>
          ) : (
            emotionData && (
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Dominant Emotion:</strong>{" "}
                  {emotionData.dominantEmotion || "N/A"}
                </p>
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
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
