import api from "./axios";


export const getInvoices = async () => {
  return await api.get("/api/invoices/fetch");
};


export const getInvoiceById = async (id) => {
  return await api.get(`/api/invoices/fetch/${id}`);
};


export const createInvoice = async (data) => {
  return await api.post("/api/invoices/create", data);
};


export const updateInvoice = async (id, data) => {
  return await api.put(`/api/api/invoices/update/${id}`, data);
};

// Delete
export const deleteInvoice = async (id) => {
  return await api.delete(`/api/invoices/delete/${id}`);
};


export const updateStatus = async (id, status) => {
  return await api.patch(`/api/invoices/${id}/status`, { status });
};