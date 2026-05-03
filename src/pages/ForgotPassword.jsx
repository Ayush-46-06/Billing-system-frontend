import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Email",
        text: "Please enter your registered email address.",
      });
    }

    try {
      Swal.fire({
        title: "Processing...",
        text: "Checking our records",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      
      await api.post(`/api/auth/forgot-password?email=${email}`);

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "If an account exists, a reset link has been sent to your email.",
      });

      navigate("/"); 

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-gray-500 mb-6 text-sm">
          No worries! Enter your email and we'll send you a reset link.
        </p>

        <input
          type="email"
          className="w-full p-3 mb-5 rounded-full bg-gray-100 border-none outline-none"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          onClick={handleForgotPassword}
        >
          Send Reset Link
        </button>

        <p className="text-sm text-center mt-6">
          Remember your password?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={() => navigate("/")}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;