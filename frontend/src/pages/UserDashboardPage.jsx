import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as faceapi from "face-api.js";

const UserDashboardPage = () => {
  const [emotion, setEmotion] = useState("");
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [confirmEmotion, setConfirmEmotion] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load face-api models
  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      console.log("Model 1 loaded.");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("Face-api models loaded");
    } catch (err) {
      console.error("Failed to load face-api models", err);
      setError("Error loading AI models.");
    }
  };

  // Start recording
  const startRecording = async () => {
    setIsRecording(true);
    setError("");
    await loadModels();

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {
          console.error("Error accessing the camera:", err);
          setError("Camera access denied. Please allow camera permissions.");
          setIsRecording(false);
        });
    }
  };

  // Stop recording
  const stopRecording = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsRecording(false);
  };

  // Capture emotion
  const captureEmotion = async () => {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length === 0) {
      setError("No face detected. Please try again.");
      return;
    }

    const expressions = detections[0].expressions;
    const topEmotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );
    setEmotion(topEmotion);
    setConfirmEmotion(true);
  };

  // Confirm and save emotion
  const confirmAndSaveEmotion = () => {
    setEmotionHistory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        emotion: emotion,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setConfirmEmotion(false);
    stopRecording();
  };

  return (
    <div className="max-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* User Dashboard */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Your Dashboard
          </h1>

          {/* Emotion Recording Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Record Your Emotion
            </h2>
            <div className="flex items-center space-x-4">
              <video
                ref={videoRef}
                style={{ transform: "scaleX(-1)", backgroundColor: "black" }}
                className="w-64 h-48 bg-black rounded-lg"
                autoPlay
                muted
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={isRecording ? captureEmotion : startRecording}
                >
                  {isRecording ? "Capture Emotion" : "Start Recording"}
                </button>
                {isRecording && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg ml-4"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </button>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>

          {/* Emotion History Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Emotion History
            </h2>
            <table className="w-full text-left border-collapse dark:text-white">
              <thead>
                <tr>
                  <th className="border-b dark:border-gray-700 p-4">#</th>
                  <th className="border-b dark:border-gray-700 p-4">Emotion</th>
                  <th className="border-b dark:border-gray-700 p-4">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="dark:text-white">
                {emotionHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="border-b dark:border-gray-700 p-4">
                      {record.id}
                    </td>
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
            {emotionHistory.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                No emotions recorded yet.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Confirm Emotion Modal */}
      {confirmEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Confirm Detected Emotion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Detected emotion: <strong>{emotion}</strong>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={confirmAndSaveEmotion}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setConfirmEmotion(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
