import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { addEmotion, getEmotion } from "../services/userService";
import { getCurrentUser } from "../services/authService";

const EMOTION_EMOJIS = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  disgusted: "🤢",
  neutral: "😐",
  fearful: "😨",
};

const UserDashboardPage = () => {
  const [emotion, setEmotion] = useState("");
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false); // Spinner for camera
  const [loadingHistory, setLoadingHistory] = useState(false); // Spinner for history
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [confirmEmotion, setConfirmEmotion] = useState(false);
  const [userId, setUserId] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserId(user.id);
      fetchEmotionHistory(user.id);
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const fetchEmotionHistory = async (userId) => {
    setLoadingHistory(true); // Start spinner
    try {
      const response = await getEmotion(userId);
      const sortedHistory = response.emotion.map((record, index) => ({
        id: index + 1,
        ...record,
      }));
      setEmotionHistory(sortedHistory);
    } catch (error) {
      console.error("Failed to fetch emotion history", error);
      setError("Error fetching emotion history. Please try again.");
    } finally {
      setLoadingHistory(false); // Stop spinner
    }
  };

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    } catch (err) {
      console.error("Failed to load face-api models", err);
      setError("Error loading AI models.");
    }
  };

  const startRecording = async () => {
    setLoadingCamera(true);
    setIsRecording(true);
    setError("");
    await loadModels();

    if (navigator.mediaDevices.getUserMedia) {
      setLoadingCamera(false);
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          // Start the countdown
          let timeLeft = 3; // 3-second countdown
          setCountdown(timeLeft);
          const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            if (timeLeft === 0) {
              clearInterval(countdownInterval);
              captureEmotion(); // Automatically capture emotion after countdown
              setCountdown(0);
            }
          }, 1000);
        })
        .catch((err) => {
          console.error("Error accessing the camera:", err);
          setError(
            "Unable to access camera. Please ensure camera permissions are allowed."
          );
          setIsRecording(false);
        })
        .finally(() => {
          setLoadingCamera(false); // Stop spinner regardless of success or failure
        });
    } else {
      setError(
        "Your browser does not support camera access. Please use a compatible browser."
      );
      setLoadingCamera(false);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
    setIsRecording(false);
    setCountdown(0); // Clear countdown if recording is stopped manually
  };

  const captureEmotion = async () => {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length === 0) {
      setError("No face detected. Please try again.");
      stopRecording();
      return;
    }

    const expressions = detections[0].expressions;
    const topEmotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );
    setEmotion(topEmotion);
    setConfirmEmotion(true);
  };

  const confirmAndSaveEmotion = async () => {
    try {
      if (userId) {
        await addEmotion({ userId, emotion });
        console.log("Emotion saved successfully");
        fetchEmotionHistory(userId);
      } else {
        console.error("User ID is missing. Unable to save emotion.");
      }

      setConfirmEmotion(false);
      stopRecording();
      setError("");
    } catch (error) {
      console.error("Failed to save emotion", error);
      setError("Failed to save emotion. Please try again.");
    }
  };
  return (
    <>
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
            {loadingCamera ? (
              <div className="flex flex-col items-center justify-center w-64 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div className="spinner" /> {/* Add spinner styling */}
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  Waiting for camera permission...
                </p>
              </div>
            ) : (
              <video
                ref={videoRef}
                style={{ transform: "scaleX(-1)" }}
                className="w-64 h-48 bg-black rounded-lg"
                autoPlay
                muted
              ></video>
            )}
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                countdown > 0 || isRecording
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={
                isRecording && countdown === 0 ? stopRecording : startRecording
              }
              disabled={countdown > 0 || isRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
          {countdown > 0 && (
            <p className="text-center text-gray-700 dark:text-gray-300 mt-4">
              Capturing in {countdown} seconds...
            </p>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Emotion History Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Emotion History
          </h2>
          {loadingHistory ? (
            <div className="animate-pulse">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"
                ></div>
              ))}
            </div>
          ) : emotionHistory.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              No emotions recorded yet.
            </p>
          ) : (
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
                      {EMOTION_EMOJIS[record.emotion] || "❓"} {record.emotion}
                    </td>
                    <td className="border-b dark:border-gray-700 p-4">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {emotionHistory.length === 0 && !loadingHistory && (
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              No emotions recorded yet.
            </p>
          )}
        </div>
      </main>
      {confirmEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Confirm Detected Emotion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Detected emotion:{" "}
              <strong className="text-lg">
                {EMOTION_EMOJIS[emotion] || "❓"} {emotion}
              </strong>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                onClick={confirmAndSaveEmotion}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                onClick={() => setConfirmEmotion(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboardPage;
