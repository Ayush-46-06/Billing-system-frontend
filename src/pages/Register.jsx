import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import logo from "../assets/color.png";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    secretKey: "",
  });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Name, Email and Password are required",
      });
    }

    try {
      Swal.fire({
        title: "Creating account...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await api.post("/api/auth/register", form);

      Swal.fire({
        icon: "success",
        title: "Registered!",
        text: "Account created successfully",
      });

      navigate("/");
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Invalid data or secret key",
      });
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeInDown { animation: fadeInDown 1s ease-out forwards; }
        .animate-slideLeft { animation: slideInLeft 1s ease-out forwards; }
        .animate-floating { animation: float 4s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex bg-[#f5f7fb]">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-24">
          <div className="flex items-center gap-4 mb-10 animate-fadeInDown">
            <img
              src={logo}
              alt="logo"
              className="h-28 w-auto object-contain"
            />
            <p className="text-sm text-gray-500 font-medium"></p>
          </div>

          <div className="animate-slideLeft">
            <h1 className="text-5xl font-semibold leading-tight mb-6 text-gray-800">
              Experience the{" "}
              <span className="text-blue-600 font-bold">Weightless</span>{" "}
              Financial Interface.
            </h1>

            <p className="text-gray-500 text-base mb-10 leading-relaxed">
              Athenura transforms billing into a seamless architectural workspace.
            </p>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-3 animate-floating">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">✦</div>
                <div>
                  <p className="font-semibold text-gray-700">Precision Automated</p>
                  <p className="text-gray-500 text-xs">
                    Real-time billing automation system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 animate-floating" style={{ animationDelay: '1s' }}>
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">⬡</div>
                <div>
                  <p className="font-semibold text-gray-700">Architectural Ledger</p>
                  <p className="text-gray-500 text-xs">
                    Structured financial data system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100">
            <h2 className="text-2xl font-semibold text-center mb-5">
              Create your account
            </h2>

            <input
              className="w-full p-3 mb-3 rounded-full bg-gray-100 outline-none"
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full p-3 mb-3 rounded-full bg-gray-100 outline-none"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pr-12 rounded-full bg-gray-100 outline-none"
                placeholder="Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div className="relative mb-3">
              <select
                className="w-full p-3 pr-10 rounded-full bg-gray-100 appearance-none outline-none"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="relative mb-5">
              <input
                type={showSecret ? "text" : "password"}
                className="w-full p-3 pr-12 rounded-full bg-gray-100 outline-none"
                placeholder="Secret Key"
                onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
              />
              <span
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition"
              onClick={handleRegister}
            >
              Create Account →
            </button>

            <p className="text-sm text-center mt-5 text-gray-500">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer font-semibold"
                onClick={() => navigate("/")}
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;