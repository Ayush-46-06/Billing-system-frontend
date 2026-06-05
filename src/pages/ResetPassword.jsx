import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2"; // ✅ added

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token'); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 6 characters long.",
      });
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Mismatch",
        text: "Passwords do not match!",
      });
    }

    if (!token) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Link",
        text: "Invalid or missing token",
      });
    }

    setLoading(true);

    try {
      Swal.fire({
        title: "Updating Password...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.post(
        `https://billing-system-backend-xd6e.onrender.com/api/auth/reset-password?token=${token}&newPassword=${newPassword}`
      );

      console.log(res.data);

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password reset successful!",
      });

      navigate("/");

    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Failed to reset password",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input 
              type="password" 
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
              placeholder="••••••••" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input 
              type="password" 
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;