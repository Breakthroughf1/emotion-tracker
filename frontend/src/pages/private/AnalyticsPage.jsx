import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { getEmotionStats } from "../../services/adminService";

// Registering necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AnalyticsPage = () => {
  const [emotionStats, setEmotionStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getEmotionStats(); // Fetch emotion stats
        setEmotionStats(stats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  if (!emotionStats) {
    return (
      <div className="text-center text-gray-900 dark:text-white">
        No data available.
      </div>
    );
  }

  const pieData = {
    labels: emotionStats.emotion_stats.map((stat) => stat.emotion),
    datasets: [
      {
        data: emotionStats.emotion_stats.map((stat) => stat.count),
        backgroundColor: [
          "#6b7280", // Neutral
          "#10b981", // Happy
          "#3b82f6", // Surprised
          "#ef4444", // Angry
        ],
        hoverBackgroundColor: [
          "#9ca3af", // Neutral
          "#34d399", // Happy
          "#60a5fa", // Surprised
          "#f87171", // Angry
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="flex-1 pl-6 pr-6 pt-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
        Emotional Analytics Dashboard
      </h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Overview
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
          Visualize and understand emotional data collected from users.
        </p>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Emotion Distribution
          </h3>
          <div className="w-72 h-72 mx-auto">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Dominant Emotion
            </h4>
            <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              {emotionStats.dominant_emotion}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Mood Balance
            </h4>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
              {emotionStats.mood_balance}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Positive Emotions
            </h4>
            <p className="text-xl font-semibold text-green-500 dark:text-green-300">
              {emotionStats.positive_count}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Negative Emotions
            </h4>
            <p className="text-xl font-semibold text-red-500 dark:text-red-300">
              {emotionStats.negative_count}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnalyticsPage;
