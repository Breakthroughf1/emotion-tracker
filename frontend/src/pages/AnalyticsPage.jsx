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
  // Dummy data for emotional analysis (you can replace this with API data)
  const [data, setData] = useState({
    labels: ["January", "February", "March", "April", "May", "June"], // Months
    datasets: [
      {
        label: "Happiness",
        data: [5, 7, 9, 3, 6, 8],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Sadness",
        data: [3, 2, 1, 4, 2, 3],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Anger",
        data: [2, 3, 4, 5, 3, 4],
        fill: false,
        borderColor: "rgb(255, 159, 64)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Fetch data from API or database here for real emotion data
    // Example:
    // fetch('/api/emotion-stats')
    //   .then(response => response.json())
    //   .then(data => setData(data));
  }, []);

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
          <Line data={data} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Emotions by User (Admin View)
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Admin users can review detailed emotion data across all registered
          users. This data can help in identifying emotional patterns and
          generating personalized reports for users.
        </p>

        {/* Additional Charts/Reports can go here */}
      </div>
    </main>
  );
};

export default AnalyticsPage;
