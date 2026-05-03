import api from "./axios";

export const login = (data) => api.post("/api/auth/login", data);
export const register = (data) => api.post("/api/auth/register", data);

export const forgotPassword = (email) => 
    api.post("/api/auth/forgot-password", null, { params: { email } });

export const changePassword = (email, oldPassword, newPassword) => 
    api.post("/api/auth/change-password", null, { 
        params: { email, oldPassword, newPassword } 
    });