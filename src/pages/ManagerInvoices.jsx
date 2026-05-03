import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import { ArrowLeft, FileText, Trash2 } from "lucide-react";

const ManagerInvoices = () => {
  const { managerId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndFilterInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/invoices/fetch");
      const allData = res.data || [];

      const filtered = allData.filter(inv => 
        inv.createdBy === state.name && inv.createdByRole === "ROLE_MANAGER"
      );

      setInvoices(filtered.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Filter failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await api.delete(`/api/invoices/delete/${id}`);
        setInvoices(invoices.filter((inv) => inv.id !== id));
        Swal.fire("Deleted!", "Invoice has been deleted.", "success");
      }
    } catch (err) {
      console.error("Delete failed", err);
      Swal.fire("Error!", "Failed to delete the invoice.", "error");
    }
  };

  useEffect(() => {
    fetchAndFilterInvoices();
  }, [managerId, state.name]);

  return (
    <div className="min-h-screen font-sans pb-10">
      <div className="max-w-[1400px] mx-auto">
        
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 px-5 py-2.5 bg-[#0052CC] text-white rounded-2xl hover:bg-[#0747A6] transition-all shadow-lg shadow-blue-100 mb-8 font-bold text-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Managers
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">
            Invoices by {state?.name || "Manager"}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Viewing {invoices.length} precise records generated under Manager role.
          </p>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[2px] border-b border-gray-50">
                  <th className="px-8 py-6">Date / ID</th>
                  <th className="px-8 py-6">Client</th>
                  <th className="px-8 py-6">Services</th>
                  <th className="px-8 py-6">Grand Total</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-32 font-bold text-gray-300 animate-pulse">
                      Filtering records...
                    </td>
                  </tr>
                ) : invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-7">
                        <p className="font-bold text-[#1E293B] text-sm whitespace-nowrap">
                          {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString("en-GB") : "-"}
                        </p>
                        <p className="text-[10px] text-gray-400 font-black mt-1 uppercase">
                          {inv.invoiceNumber || `#${inv.id}`}
                        </p>
                      </td>

                      <td className="px-8 py-7 font-bold text-[#1E293B] text-sm whitespace-nowrap">
                        {inv.clientName}
                      </td>

                      <td className="px-8 py-7">
                        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                          {inv.items && inv.items.length > 0 ? (
                            inv.items.map((item, idx) => (
                              <span key={idx} className="text-sm font-bold text-[#1E293B] whitespace-nowrap">
                                {item.serviceName}{idx < inv.items.length - 1 ? "," : ""}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-300 text-[10px] italic">No services</span>
                          )}
                        </div>
                      </td>

                      <td className="px-8 py-7 font-black text-[#1E293B] text-sm whitespace-nowrap">
                        ₹{inv.grandTotal?.toLocaleString()}
                      </td>

                      <td className="px-8 py-7 text-center">
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${
                          inv.paymentStatus === "PAID" 
                          ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700" 
                        }`}>
                          {inv.paymentStatus}
                        </span>
                      </td>

                      <td className="px-8 py-7 text-right">
                        <div className="flex justify-end items-center gap-3">
                          {inv.pdfUrl ? (
                            <a 
                              href={inv.pdfUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"
                              title="View PDF"
                            >
                              <FileText size={18} />
                            </a>
                          ) : (
                            <button 
                              onClick={() => Swal.fire("Wait", "PDF is still generating", "info")}
                              className="p-2.5 text-gray-300 bg-gray-100 rounded-xl cursor-pointer"
                            >
                              <FileText size={18} />
                            </button>
                          )}

                          <button 
                            onClick={() => handleDelete(inv.id)}
                            className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colour shadow-sm"
                            title="Delete Invoice"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <div className="bg-gray-50 inline-block p-6 rounded-full mb-4 text-gray-300">
                        <FileText size={40} />
                      </div>
                      <p className="text-gray-400 font-bold text-sm">No manager invoices found for this user.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerInvoices;