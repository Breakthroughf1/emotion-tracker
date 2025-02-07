import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, registerFaceData } from "../../services/authService";
import * as faceapi from "face-api.js";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceCanvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    } catch (error) {
      console.error("Face API models failed to load:", error);
      setError("Failed to load face detection models.");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play(); // Ensure the video starts playing
          detectFace();
        };
      }
    } catch (err) {
      console.error("Camera access failed", err);
      setError("Failed to access the camera.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !faceCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = faceCanvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn("Video dimensions are not yet available.");
      setTimeout(detectFace, 500); // Retry after a short delay
      return;
    }

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      if (!video.paused && !video.ended) {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        setFaceDetected(detections.length > 0);

        if (detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          const canvasCtx = canvas.getContext("2d");
          if (canvasCtx) {
            canvasCtx.clearRect(0, 0, displaySize.width, displaySize.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
          }
        }
      }
      requestAnimationFrame(detect);
    };

    requestAnimationFrame(detect);
  };

  const captureFaceImage = async () => {
    if (!faceDetected) {
      setError("No face detected. Please ensure your face is visible.");
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setError("Camera not initialized.");
      return;
    }

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let faceData = canvas.toDataURL("image/png").split(",")[1];
    return faceData;
  };

  const handleEnrollFace = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const face_data = await captureFaceImage();
      if (!face_data) {
        setLoading(false);
        return;
      }

      const userFaceData = {
        email: email,
        face_data: face_data,
      };

      const data = await registerFaceData(userFaceData);

      setSuccess("Face enrolled successfully!");
      localStorage.setItem("token", data.token);
      stopCamera();
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Error enrolling face:", err);
      setError(err.message || "Failed to enroll face. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await registerUser({ name, email, password });
      setSuccess("Registration successful! Redirecting ...");
      setIsFlipped(true);
      setTimeout(() => {
        setPassword("");
        setConfirmPassword("");
        setSuccess("");
        startCamera();
      }, 1000);
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFlipped) {
      startCamera();
    } else {
      stopCamera();
    }

    return stopCamera;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped]);

  return (
    <section
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url('ai-generated-8612487_1280.jpg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-md bg-gray-800 opacity-85 dark:border-gray-700 relative z-10 transform transition-transform duration-1000 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {!isFlipped ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
              Create Your Account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Sign up to get started
            </p>
            {error && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg">
                {success}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-100"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full p-2 pr-10 border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-9 text-sm text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-100"
                >
                  Confirm Password
                </label>
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full p-2 pr-10 border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-9 text-sm text-gray-400 hover:text-gray-300"
                >
                  {showPasswordConfirm ? (
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                Sign in
              </a>
            </p>
          </>
        ) : (
          <div className="mt-4 text-center transform transition-all duration-1000 rotate-y-180">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Enroll Your Face
            </h2>
            {/* Placeholder for Camera View */}
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                width="300"
                style={{ transform: "scaleX(-1)", backgroundColor: "black" }}
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <canvas ref={faceCanvasRef} width="300" height="300" />
            </div>
            {error && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg">
                {success}
              </div>
            )}
            {/* Enroll Button */}
            <button
              onClick={handleEnrollFace}
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 ${
                loading ? "opacity-60" : "hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Enrolling..." : "Enroll Now"}
            </button>

            {/* Instructions */}
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-center text-sm">
              Position your face in front of the camera and click{" "}
              <strong>Enroll Now</strong>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegistrationPage;
