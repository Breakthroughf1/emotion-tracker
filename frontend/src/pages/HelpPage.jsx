import React from "react";

const HelpPage = () => {
  return (
    <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Help & Information
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          About EmotionTracker
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <strong>EmotionTracker</strong> is an advanced web application that
          captures and analyzes user emotions through facial expressions using
          AI. It utilizes facial recognition to detect emotional states in
          real-time, providing users with insights into their emotional
          patterns. The application is designed with secure authentication,
          ensuring user privacy, and an intuitive dashboard for both users and
          admins to manage and review emotional data effectively.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          How to Use EmotionTracker
        </h3>
        <div className="ml-6 mb-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            For Users
          </h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              <strong>Step 1 - Register an Account:</strong> Start by
              registering for an account using your email address. During
              registration, you will also be prompted to provide facial data for
              emotion detection.
            </li>
            <li>
              <strong>Step 2 - Log in:</strong> Use your credentials to log in
              securely to the EmotionTracker dashboard.
            </li>
            <li>
              <strong>Step 3 - Emotion Detection:</strong> Once logged in, use
              your webcam to capture your facial expressions. The AI will
              analyze your emotions in real-time and provide feedback on your
              emotional state (e.g., happy, sad, angry, neutral).
            </li>
            <li>
              <strong>Step 4 - View Emotion History:</strong> Review your
              previous emotional data, including the timestamp of when each
              emotion was detected.
            </li>
            <li>
              <strong>Step 5 - Insights:</strong> Over time, the app will track
              your emotional patterns and offer insights into your emotional
              well-being. This can be useful for personal reflection and
              emotional health management.
            </li>
          </ul>
        </div>

        <div className="ml-6 mb-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            For Admins
          </h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              <strong>Step 1 - Log in to the Admin Dashboard:</strong> Admins
              can log in to a separate dashboard where they can manage all user
              accounts.
            </li>
            <li>
              <strong>Step 2 - Manage Users:</strong> Admins can view and manage
              the list of registered users, update user data, and delete
              accounts if necessary.
            </li>
            <li>
              <strong>Step 3 - View Emotion Data:</strong> Admins can access
              detailed emotion data from all users, including individual
              emotional patterns over time.
            </li>
            <li>
              <strong>Step 4 - Data Analytics:</strong> The admin dashboard
              provides analytical tools to better understand emotional trends
              across users and generate reports.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h3>
        <div className="ml-6 mb-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            User Features
          </h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              <strong>Secure Registration & Login:</strong> Users can register
              with their email and facial data.
            </li>
            <li>
              <strong>Emotion Detection:</strong> Analyze current facial
              expressions and record emotions in real-time.
            </li>
            <li>
              <strong>Emotion History:</strong> View previously recorded
              emotions with timestamps.
            </li>
          </ul>
        </div>

        <div className="ml-6 mb-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Admin Features
          </h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>
              <strong>User Management:</strong> Admins can view and manage all
              registered users.
            </li>
            <li>
              <strong>Emotion Overview:</strong> Admins can analyze all user
              emotion data.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          About the Developers
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {" "}
          <a
            href="https://breakthrough.ind.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 cursor-pointer"
          >
            <strong>Breakthrough</strong>
          </a>{" "}
          is developed by the team at{" "}
          <a
            href="https://breakthrough.ind.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 cursor-pointer"
          >
            <strong>Breakthrough</strong>
          </a>{" "}
          . Breakthrough is an innovative organization focused on creating
          advanced applications with cutting-edge AI technologies. Our mission
          is to develop intelligent solutions that improve human experiences and
          contribute to global challenges.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          For more information or to get in touch with the team, please visit
          the official{" "}
          <a
            href="https://breakthrough.ind.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 cursor-pointer"
          >
            <strong>Breakthrough</strong>
          </a>{" "}
          website or connect with us on LinkedIn.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          If you have any questions or need support, feel free to reach out via
          email at{" "}
          <a
            href="mailto:info@breakthrough.ind.in"
            className="text-blue-600 dark:text-blue-400"
          >
            info@breakthrough.ind.in
          </a>
          . For updates and news, follow us on our official{" "}
          <a
            href="https://www.linkedin.com/company/breakthrough-pvt-ltd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 cursor-pointer"
          >
            LinkedIn page
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default HelpPage;
