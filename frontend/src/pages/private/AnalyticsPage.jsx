import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { getEmotionStats } from "../../services/adminService";

// Registering necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const AnalyticsPage = () => {
  const [emotionStats, setEmotionStats] = useState(null);
  const [emotionTrends, setEmotionTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch emotion stats and trends
        const stats = await getEmotionStats();
        // const trends = await getEmotionTrends("user_id_here"); // Replace with actual user ID or filter as needed

        // Set state with fetched data
        setEmotionStats(stats);
        // setEmotionTrends(trends);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data based on fetched stats
  const chartData = {
    labels: emotionTrends ? Object.keys(emotionTrends.emotion_trends) : [], // Dates as x-axis
    datasets: [
      {
        label: "Happiness",
        data: emotionTrends
          ? emotionTrends.emotion_trends.map((date) => date["happy"] || 0)
          : [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Sadness",
        data: emotionTrends
          ? emotionTrends.emotion_trends.map((date) => date["sad"] || 0)
          : [],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Anger",
        data: emotionTrends
          ? emotionTrends.emotion_trends.map((date) => date["angry"] || 0)
          : [],
        fill: false,
        borderColor: "rgb(255, 159, 64)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Analytics
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Emotional Analytics Overview
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This page provides an overview of the emotional data collected from
          users. The following charts display trends and statistics on emotions
          like happiness, sadness, and anger over time.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Emotion Trends Over Time
        </h3>
        <div className="w-full h-96 mb-6">
          <Line data={chartData} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Emotions by User (Admin View)
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Admin users can review detailed emotion data across all registered
          users. This data can help in identifying emotional patterns and
          generating personalized reports for users.
        </p>

        <div>
          <h4 className="text-md font-bold text-gray-900 dark:text-white mb-2">
            Dominant Emotion: {emotionStats.dominant_emotion}
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Positive Mood: {emotionStats.positive_count}, Negative Mood:{" "}
            {emotionStats.negative_count}
          </p>
        </div>

        {/* Additional charts or stats can go here */}
      </div>
    </main>
  );
};

export default AnalyticsPage;
