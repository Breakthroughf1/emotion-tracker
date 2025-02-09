import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { addEmotion, getEmotion, getProfile } from "../services/userService";
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
  const [error, setError] = useState(null);
  const [confirmEmotion, setConfirmEmotion] = useState(false);
  const [userId, setUserId] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserId(user.id);
      fetchEmotionHistory(user.id);
    }
    loadModels();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    } catch (err) {
      console.error("Failed to load face-api models", err);
      showError("Error loading AI models.");
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

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
      showError("Error fetching emotion history. Please try again.");
    } finally {
      setLoadingHistory(false); // Stop spinner
    }
  };

  const startRecording = async () => {
    setLoadingCamera(true);
    setIsRecording(true);
    setError(null);
    await loadModels();

    const profileImageUrl = await getProfile(); // Get profile image URL
    const profileImage = await faceapi.fetchImage(profileImageUrl); // Load profile image

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
          const countdownInterval = setInterval(async () => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            if (timeLeft === 0) {
              clearInterval(countdownInterval);
              // Parallel face verification
              const detections = await faceapi
                .detectSingleFace(
                  videoRef.current,
                  new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks()
                .withFaceDescriptor();
              if (detections) {
                const profileFace = await faceapi
                  .detectSingleFace(
                    profileImage,
                    new faceapi.TinyFaceDetectorOptions()
                  )
                  .withFaceLandmarks()
                  .withFaceDescriptor();

                if (profileFace) {
                  const faceMatcher = new faceapi.FaceMatcher(profileFace);
                  const bestMatch = faceMatcher.findBestMatch(
                    detections.descriptor
                  );
                  if (bestMatch.distance > 0.4) {
                    // Adjust threshold if needed
                    console.log(bestMatch.distance);
                    clearInterval(countdownInterval);
                    showError("Face does not match profile picture.");
                    stopRecording();
                    setIsRecording(false);
                    return;
                  } else {
                    console.log(bestMatch.distance);
                    captureEmotion(); // Automatically capture emotion after countdown
                    setCountdown(0);
                  }
                } else {
                  clearInterval(countdownInterval);
                  showError(
                    "Profile picture is not suitable for verification."
                  );
                  stopRecording();
                  setIsRecording(false);
                  return;
                }
              } else {
                clearInterval(countdownInterval);
                showError("No face detected in the camera.");
                stopRecording();
                setIsRecording(false);
                return;
              }
            }
          }, 1000);
        })
        .catch((err) => {
          console.error("Error accessing the camera:", err);
          showError(
            "Unable to access camera. Please ensure camera permissions are allowed."
          );
          setIsRecording(false);
          stopRecording();
        })
        .finally(() => {
          setLoadingCamera(false); // Stop spinner regardless of success or failure
        });
    } else {
      showError(
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
    // Get emotions
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length === 0) {
      showError("No face detected for emotion analysis.");
      stopRecording();
      return;
    }

    const expressions = detections.expressions;
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
      setError(null);
    } catch (error) {
      console.error("Failed to save emotion", error);
      showError("Failed to save emotion. Please try again.");
    }
  };
  return (
    <>
      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2">
          <div
            id="alert-border-2"
            className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
            role="alert"
          >
            <svg
              className="shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div className="ms-3 text-sm font-medium">{error}</div>
            <button
              type="button"
              className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
              onClick={() => setError(null)}
              aria-label="Close"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
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
                onClick={() => {
                  setConfirmEmotion(false);
                  stopRecording();
                  setError(null);
                }}
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
