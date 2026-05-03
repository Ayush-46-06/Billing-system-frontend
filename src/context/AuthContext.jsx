import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const init = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await fetchUser();
    }

    setLoading(false); 
  };

  init();
}, []);

 const login = async (email, password) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });

    const { token } = res.data;
    localStorage.setItem("token", token);

    
    const userRes = await api.get("/api/user/me");

    setUser(userRes.data);
    localStorage.setItem("user", JSON.stringify(userRes.data));

    return { success: true };

  } catch (err) {
    console.error("Login Error:", err);
    return {
      success: false,
      error: err.response?.data?.message || "Login failed",
    };
  }
};


  const register = async (form) => {
    try {
    
      await api.post("/api/auth/register", form);
      return { success: true };
    } catch (err) {
      console.error("Register Error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Register failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };


  const fetchUser = async () => {
  try {
    const res = await api.get("/api/user/me");

    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));

  } catch (err) {
    console.error("Fetch user failed", err);
    logout();
  }
};

  return (
    <AuthContext.Provider value={{ user,setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};