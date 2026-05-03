import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import StatusBadge from "../components/StatusBadge";
import { Trash2, FileText, Mail, Pencil, CheckCircle } from "lucide-react";

const Invoices = () => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Time");
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/invoices/fetch");
      const sortedData = (res.data || []).sort((a, b) => b.id - a.id);
      setAllInvoices(sortedData);
      setFilteredInvoices(sortedData);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFilter = (type) => {
    setActiveFilter(type);
    let filtered = [...allInvoices];
    if (type === "PAID")
      filtered = filtered.filter((inv) => inv.paymentStatus === "PAID");
    if (type === "UNPAID")
      filtered = filtered.filter((inv) => inv.paymentStatus !== "PAID");
    if (type === "DUE") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((inv) => {
        const due = new Date(inv.dueDate);
        return inv.paymentStatus !== "PAID" && due < today;
      });
    }
    setFilteredInvoices(filtered);
  };

  const deleteInvoice = async (id) => {
    const confirm1 = await Swal.fire({
      title: "Delete Invoice?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Continue",
    });
    if (!confirm1.isConfirmed) return;
    const confirm2 = await Swal.fire({
      title: "Are you absolutely sure?",
      text: "This will permanently delete the invoice and all its data.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, proceed",
    });
    if (!confirm2.isConfirmed) return;
    try {
      await api.delete(`/api/invoices/delete/${id}`);
      Swal.fire("Deleted!", "Invoice removed.", "success");
      fetchInvoices();
    } catch {
      Swal.fire("Error", "Failed to delete.", "error");
    }
  };

  const totalOutstanding = filteredInvoices.reduce(
    (acc, inv) => acc + (inv.grandTotal || 0),
    0,
  );

  const sendInvoice = async (inv) => {
    try {
      if (!inv.pdfUrl) {
        Swal.fire("Wait", "PDF is still generating", "info");
        return;
      }
      const firstConfirm = await Swal.fire({
        title: "Send Invoice?",
        text: `This will send invoice to ${inv.clientEmail}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Continue",
      });
      if (!firstConfirm.isConfirmed) return;
      const secondConfirm = await Swal.fire({
        title: "Are you sure?",
        text: "Invoice will be marked as SENT and email will be triggered.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Send",
      });
      if (!secondConfirm.isConfirmed) return;
      await api.put(`/api/invoices/update/${inv.id}`, { status: "SENT" });
      Swal.fire("Success", "Invoice sent successfully", "success");
      fetchInvoices();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to send invoice",
        "error",
      );
    }
  };

  const applyDateFilter = () => {
    let filtered = [...allInvoices];

    if (activeFilter === "PAID") {
      filtered = filtered.filter((inv) => inv.paymentStatus === "PAID");
    } else if (activeFilter === "UNPAID") {
      filtered = filtered.filter((inv) => inv.paymentStatus !== "PAID");
    } else if (activeFilter === "DUE") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((inv) => {
        const due = new Date(inv.dueDate);
        return inv.paymentStatus !== "PAID" && due < today;
      });
    }

    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter((inv) => new Date(inv.invoiceDate) >= start);
    }

    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((inv) => new Date(inv.invoiceDate) <= end);
    }

    setFilteredInvoices(filtered);
  };

  return (
    <div className="min-h-screen font-sans pb-20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">
              Invoices
            </h1>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1 mb-1">
              Managing your cash flow with architectural precision.
            </p>
          </div>
          <button
            onClick={() => navigate("/invoices/create")}
            className="bg-[#0052CC] text-white px-8 py-4 font-black text-[11px] uppercase tracking-widest rounded-full shadow-xl shadow-blue-200 transition-all hover:translate-y-[-2px] active:scale-95"
          >
            Create New Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <div className="md:col-span-4 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Total Outstanding
            </p>
            <h3 className="text-3xl font-black text-[#1E293B]">
              ₹{totalOutstanding.toLocaleString()}
            </h3>
          </div>
          <div className="md:col-span-8 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
              Quick Filters
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {["All", "PAID", "UNPAID", "DUE"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilter(tab)}
                  className={`px-4 py-2 rounded-full text-[11px] font-black transition-all border ${
                    activeFilter === tab
                      ? "bg-[#EEF2FF] text-[#0052CC] border-[#E0E7FF]"
                      : "text-gray-400 border-transparent hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border px-1 py-2 rounded-full text-sm"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border px-1 py-2 rounded-full text-sm"
                />
                <button
                  onClick={applyDateFilter}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    handleFilter(activeFilter);
                  }}
                  className="bg-gray-200 px-4 py-2 rounded-full text-sm font-bold"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] border-b border-gray-50">
                  <th className="pl-10 pr-4 py-8 text-center">Date</th>
                  <th className="px-6 py-8 text-center">Created By</th>
                  <th className="px-6 py-8 text-center">Invoice</th>
                  <th className="px-6 py-8 text-center">Client</th>
                  <th className="px-6 py-8 text-center">Services</th>
                  <th className="px-6 py-8 text-center">Grand Total</th>
                  <th className="px-6 py-8 text-center">Status</th>
                  <th className="pr-10 py-8 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-32 font-bold text-gray-300 animate-pulse"
                    >
                      Fetching records...
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-7 font-bold text-[#1E293B] text-sm text-center whitespace-nowrap">
                        {inv.invoiceDate
                          ? new Date(inv.invoiceDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </td>

                      <td className="px-6 py-7 text-center">
                        <div className="max-w-[160px] mx-auto flex flex-col items-center">
                          <span className="font-bold text-[#1E293B] text-sm break-words whitespace-normal capitalize text-center">
                            {inv.createdBy || "System"}
                          </span>

                          <span
                            className={`text-[8px] font-black px-2 py-0.5 rounded-md mt-1 border ${
                              inv.createdByRole === "ROLE_ADMIN"
                                ? "bg-purple-50 text-purple-600 border-purple-100"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                            }`}
                          >
                            {inv.createdByRole?.replace("ROLE_", "") || "USER"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-7 font-bold text-[#1E293B] text-sm text-center whitespace-nowrap">
                        {inv.invoiceNumber || `#${inv.id}`}
                      </td>
                      <td className="px-6 py-7 text-center">
                        <div className="max-w-[180px] mx-auto">
                          <p className="text-sm font-bold text-[#1E293B] break-words whitespace-normal">
                            {inv.clientName}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-7 text-center">
                        <div className="max-w-[220px] mx-auto">
                          {inv.items && inv.items.length > 0 ? (
                            <p className="text-sm font-bold text-[#1E293B] break-words whitespace-normal">
                              {inv.items
                                .map((item) => item.serviceName || "Service")
                                .join(", ")}
                            </p>
                          ) : (
                            <span className="text-gray-300 text-[10px] italic">
                              No items
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-7 font-black text-[#1E293B] text-sm text-center whitespace-nowrap">
                        ₹{inv.grandTotal?.toLocaleString()}
                      </td>
                      <td className="px-6 py-7 text-center">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${inv.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="pr-10 py-7 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                            className="p-2.5 text-yellow-600 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
                          >
                            <Pencil size={18} />
                          </button>
                          <div className="flex items-center gap-1">
                            {inv.pdfUrl && (
                              <a
                                href={inv.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                              >
                                <FileText size={18} />
                              </a>
                            )}
                            <button
                              onClick={() => sendInvoice(inv)}
                              disabled={!inv.pdfUrl}
                              className={`p-2.5 rounded-xl ${inv.pdfUrl ? "text-green-600 bg-green-50 hover:bg-green-100" : "text-gray-300 bg-gray-100 cursor-not-allowed"}`}
                            >
                              <Mail size={18} />
                            </button>
                            <button
                              onClick={() => deleteInvoice(inv.id)}
                              className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colour shadow-sm"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && filteredInvoices.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-gray-50 inline-block p-6 rounded-full mb-4 text-gray-300">
                <FileText size={40} />
              </div>
              <p className="text-gray-400 font-bold">
                No invoices found for this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;