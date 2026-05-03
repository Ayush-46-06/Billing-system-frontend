import api from "./axios";


export const getDashboardStats = async () => {
  try {
    
    const response = await api.get("/api/payments/dashboard-stats"); 
    return response;
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};


export const getRecentTransactions = async () => {
  return await api.get("/api/payments/stream");
};