import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";


const Profile = () => {
  const { user, setUser } = useAuth();
  const [avatar, setAvatar] = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleUpload = () => {
    if (!isEditing) return;
    fileRef.current.click();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("http://localhost:8080/api/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAvatar(res.data.profileImage);
      setName(res.data.name);
      setEmail(res.data.email);
      setDepartment(res.data.department || "");
    };

    fetchProfile();
  }, []);

  const handleFileChange = async (e) => {
    if (!isEditing) return;

    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:8080/api/user/upload-profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setAvatar(res.data.url);
    setUser({
      ...user,
      profileImage: res.data.url,
    });
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Email",
        text: "Enter your email",
      });
    }

    setForgotLoading(true);

    try {
      await axios.post(
        `http://localhost:8080/api/auth/forgot-password?email=${forgotEmail}`
      );

      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: "Reset link sent!",
      });

      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error sending email",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await axios.put(
        "http://localhost:8080/api/user/update",
        {
          name: name,
          department: department
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsEditing(false);

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-800 mb-1">Profile Settings</h1>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1 mb-6">
              Manage your account details and preferences
            </p>
          </div>

          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-white text-black border border-gray-200 font-bold rounded-xl text-[10px] uppercase hover:bg-gray-100 transition-all"
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-full"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center">
            <div className="relative mb-4">
              <div
                className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
                onClick={handleUpload}
              >
                <img
                  src={avatar || "/avatar.png"}
                  onError={(e) => (e.target.src = "/avatar.png")}
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <div
                  onClick={handleUpload}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition"
                >
                  ✏️
                </div>
              )}

              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <h2 className="font-semibold text-lg">{user?.name || "User"}</h2>
            <p className="text-sm text-gray-500 mb-1">{user?.email}</p>
            <p className="text-sm text-gray-500">{department}</p>

            {isEditing && (
              <button
                onClick={handleUpload}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 mt-2"
              >
                Upload Photo
              </button>
            )}
          </div>

          <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="font-semibold text-lg mb-4">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="text-xs text-gray-500 font-semibold">Name</label>
                  <input
                    value={name}
                    disabled={!isEditing}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-gray-50"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold">Email</label>
                  <input
                    value={email}
                    disabled
                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-semibold">Department</label>
                  <input
                    value={department}
                    disabled={!isEditing}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border bg-gray-50"
                  />
                </div>

              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">Security</h3>
                <p className="text-sm text-gray-500">
                  Reset your password securely
                </p>
              </div>

              <button
                onClick={() => setShowForgotModal(true)}
                className="px-5 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
              >
                Reset Password
              </button>
            </div>

          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-2">Forgot Password?</h2>

            <p className="text-sm text-gray-500 mb-4">
              Enter your email and we’ll send a reset link.
            </p>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full p-3 border rounded mb-4"
            />

            <button
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              className={`w-full text-white py-2 rounded ${
                forgotLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;