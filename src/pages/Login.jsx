import React, { useState } from "react"; 
import api from "../api/axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import workspaceImg from "../assets/Workspace.svg";
import logo from "../assets/color.png";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showResetModal, setShowResetModal] = useState(!!token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: localStorage.getItem("rememberEmail") || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(!!localStorage.getItem("rememberEmail"));

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return Swal.fire("Error", "Please fill all fields", "warning");
    }
    try {
      const res = await api.post("/api/auth/login", form);
      const { token } = res.data;
      localStorage.setItem("token", token);
      const userRes = await api.get("/api/user/me");
      setUser(userRes.data);
      localStorage.setItem("user", JSON.stringify(userRes.data));
      if (remember) {
        localStorage.setItem("rememberEmail", form.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }
      Swal.fire({ icon: "success", title: "Login Successful", timer: 1500, showConfirmButton: false });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid email or password",
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters long."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match!"); return; }
    if (!token) { setError("Invalid token"); return; }
    setLoading(true);
    try {
      await api.post(`/api/auth/reset-password?token=${token}&newPassword=${newPassword}`);
      Swal.fire("Success", "Password reset successful", "success");
      setShowResetModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Reset failed");
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) { return Swal.fire("Warning", "Enter your email", "warning"); }
    setForgotLoading(true);
    try {
      await api.post(`/api/auth/forgot-password?email=${forgotEmail}`);
      Swal.fire("Email Sent", "If account exists, reset link sent.", "success");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally { setForgotLoading(false); }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes customFade { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeInDown { animation: fadeInDown 1s ease-out forwards; }
        .animate-slideLeft { animation: slideInLeft 1s ease-out forwards; }
        .animate-floating { animation: float 4s ease-in-out infinite; }
        .animate-list { opacity: 0; animation: customFade 0.5s ease-in forwards; }

        .page-bg {
          background-color: #ffffff;
          background-image: 
            radial-gradient(at 0% 0%, #f0f4ff 0%, transparent 60%), 
            radial-gradient(at 100% 0%, #e0eaff 0%, transparent 50%),
            radial-gradient(at 50% 100%, #f9fbff 0%, transparent 50%);
          background-attachment: fixed;
        }
      `}</style>

      <div className="min-h-screen flex page-bg overflow-hidden items-center justify-center p-4 relative">
        <Link to="/" className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:shadow-md z-50">
          <ArrowLeft size={18} /> Back to Home
        </Link>
        
        <div className="flex w-full max-w-6xl items-center justify-between gap-12">
          
          <div className="hidden lg:flex w-1/2 flex-col justify-center px-6">
            <div className="relative z-10 mb-10 animate-fadeInDown">
              <img
                src={logo}
                alt="logo"
                className="h-24 w-auto object-contain"
              />
            </div>

            <div className="relative z-10 space-y-8 animate-slideLeft">
              <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                Secure workspace access
              </h2>

              <ul className="space-y-4 text-base text-slate-500 font-medium">
                <li className="animate-list" style={{ animationDelay: '0.4s' }}>• Role-based access control</li>
                <li className="animate-list" style={{ animationDelay: '0.6s' }}>• Controlled task visibility</li>
                <li className="animate-list" style={{ animationDelay: '0.8s' }}>• Deadline-driven execution</li>
                <li className="animate-list" style={{ animationDelay: '1s' }}>• Organization-managed access</li>
              </ul>
            </div>

            <div className="relative z-10 mt-12 animate-floating">
              <img src={workspaceImg} alt="Workspace" className="w-[90%] max-h-[350px] drop-shadow-xl" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white/50">
              <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mb-6 text-sm">Sign in to access your workspace</p>

              <label className="text-xs text-gray-400 uppercase font-bold ml-1">Email</label>
              <input
                type="email"
                className="w-full p-3 mb-4 mt-1 rounded-full bg-[#f8faff] outline-none text-sm border border-slate-100 focus:border-blue-400 transition-all"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <label className="text-xs text-gray-400 uppercase font-bold ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 mb-4 mt-1 rounded-full bg-[#f8faff] outline-none text-sm pr-10 border border-slate-100 focus:border-blue-400 transition-all"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center justify-between mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 cursor-pointer" onClick={() => setRemember(!remember)}>
                  <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={remember} readOnly />
                  <label className="cursor-pointer">Remember me</label>
                </div>
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setShowForgotModal(true)}>
                  Forgot Password?
                </span>
              </div>

              <button
                onClick={handleLogin}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                Log in →
              </button>

              <p className="text-sm text-center mt-6 text-gray-500">
                New user?{" "}
                <span className="text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => navigate("/register")}>
                  Create Account
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showResetModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
              <button onClick={() => setShowResetModal(false)} className="absolute top-3 right-4 text-gray-500 text-xl">×</button>
              <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
              {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
              <form onSubmit={handleResetPassword} className="space-y-3">
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 border rounded-xl" required />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border rounded-xl" required />
                <button type="submit" disabled={loading} className={`w-full text-white py-2 rounded-xl ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {loading ? "Updating..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        )}

      {showForgotModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
              <button onClick={() => setShowForgotModal(false)} className="absolute top-3 right-4 text-gray-500 text-xl">×</button>
              <h2 className="text-xl font-semibold mb-2">Forgot Password?</h2>
              <p className="text-sm text-gray-500 mb-4">Enter your email and we’ll send a reset link.</p>
              <input type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()} className="w-full p-3 border rounded-xl mb-4" />
              <button onClick={handleForgotPassword} disabled={forgotLoading} className={`w-full text-white py-2 rounded-xl ${forgotLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default Login;