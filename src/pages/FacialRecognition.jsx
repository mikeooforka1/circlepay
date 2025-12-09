import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FacialRecognition() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);
  const [stream, setStream] = useState(null);

  // Start camera
  const startCamera = async () => {
    setError("");
    setCaptured(false);
    setScanning(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch {
      setError("Unable to access camera. Please allow camera permission and use HTTPS or localhost.");
      setScanning(false);
    }
  };

  // Attach stream to video when available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Capture face image from video
  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(true);
    setScanning(false);
    // Stop camera after capture
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Send face image to backend
  const handleSubmit = async () => {
    setError("");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("User not found. Please login again.");
      navigate("/login");
      return;
    }
    if (!canvasRef.current) {
      setError("No face image captured.");
      return;
    }
    const imageData = canvasRef.current.toDataURL("image/jpeg");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/facial-recognition`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, faceImage: imageData }),
        }
      );
      const data = await res.json();
      if (data.success) {
        navigate("/set-transaction-code");
      } else {
        setError(data.message || "Facial recognition failed. Try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-yellow-400">
      <h2 className="text-2xl font-bold mb-4">Facial Recognition</h2>
      <p className="mb-6">
        Please complete facial recognition to secure your account.
      </p>
      {!scanning && (
        <button
          className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold mb-4"
          onClick={startCamera}
        >
          Start Camera
        </button>
      )}
      {scanning && (
        <div className="flex flex-col items-center mb-4">
          <video ref={videoRef} width={320} height={240} className="rounded-lg border-2 border-yellow-400 mb-2" />
          <button
            className="px-6 py-2 rounded-xl bg-yellow-400 text-black font-bold"
            onClick={captureFace}
          >
            Capture Face
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: captured ? "block" : "none", borderRadius: "0.75rem", border: "2px solid #FFD700", marginBottom: "1rem" }} width={320} height={240} />
      {captured && (
        <button
          className="px-6 py-3 rounded-xl bg-yellow-700 text-white font-bold mb-2"
          onClick={handleSubmit}
        >
          Submit Face for Verification
        </button>
      )}
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
}