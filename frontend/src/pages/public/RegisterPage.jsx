import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, registerFaceData } from "../../services/authService";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
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
  };

  useEffect(() => {
    if (isFlipped) {
      startCamera();
    } else {
      stopCamera();
    }
    // Clean up when component unmounts
    return stopCamera;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped]);

  const captureFaceImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the image to base64
    let faceData = canvas.toDataURL("image/png");

    // Remove the metadata prefix
    faceData = faceData.replace(/^data:image\/png;base64,/, "");

    return faceData;
  };

  const handleEnrollFace = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const face_data = await captureFaceImage();

      // Correctly structure the request payload
      const userFaceData = {
        email: email,
        face_data: face_data,
      };

      // Send the payload to the backend
      const data = await registerFaceData(userFaceData);

      setSuccess("Face enrolled successfully!");
      localStorage.setItem("token", data.token);
      stopCamera();
      navigate("/");
    } catch (err) {
      console.error("Error enrolling face:", err);
      setError("Failed to enroll the face. Please try again.");
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
      // Trigger the flip animation
      setIsFlipped(true);

      // Clear input fields after a short delay to show the flip animation
      setTimeout(() => {
        setPassword("");
        setConfirmPassword("");
        setSuccess("");
      }, 1000);
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        className={`w-full max-w-md p-6 rounded-lg shadow-md bg-gray-800 opacity-85 dark:border-gray-700 relative z-10 transform transition-all duration-1000 ${
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
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
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
