import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import { X, Trash2, Plus, FileText, User, MapPin, Mail, Phone } from "lucide-react";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clientRes = await api.get(`/api/clients/${id}`);
      setClient(clientRes.data);

      try {
        const invoiceRes = await api.get(`/api/invoices/fetch`);
        const clientInvoices = (invoiceRes.data || []).filter(
          inv => inv.clientId === Number(id) || inv.client?.id === Number(id)
        );
        setInvoices(clientInvoices);
      } catch (invErr) {
        console.error("Invoices load failed:", invErr);
      }
    } catch (err) {
      console.error("Client fetch error:", err);
      Swal.fire("Error", "Client not found", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(client.phone)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid 10-digit phone number.",
        confirmButtonColor: "#ef4444"
      });
    }

    try {
      Swal.fire({ title: "Updating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await api.put(`/api/clients/${id}`, client);
      Swal.fire({ icon: "success", title: "Updated", timer: 1000, showConfirmButton: false });
      setEditMode(false);
      fetchData();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update failed" });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({ 
      title: "Delete Client?", 
      text: "This will remove the client permanently.",
      icon: "warning", 
      showCancelButton: true, 
      confirmButtonColor: "#ef4444" 
    });
    if (result.isConfirmed) {
      try { 
        await api.delete(`/api/clients/${id}`); 
        navigate("/customers"); 
      } catch { 
        Swal.fire({ icon: "error", title: "Error" }); 
      }
    }
  };

  const deleteSingleInvoice = async (e, invoiceId) => {
    e.stopPropagation(); 
    const result = await Swal.fire({
      title: "Delete Invoice?",
      text: "This invoice will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/invoices/delete/${invoiceId}`);
        setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
        Swal.fire("Deleted!", "Invoice has been removed.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete invoice.", "error");
      }
    }
  };

  const deleteAllInvoices = async () => {
    if (invoices.length === 0) return;
    
    const result = await Swal.fire({
      title: "Delete All Invoices?",
      text: `You are about to delete all ${invoices.length} invoices for this client.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete all!"
    });

    if (result.isConfirmed) {
      try {
       
        await Promise.all(invoices.map(inv => api.delete(`/api/invoices/delete/${inv.id}`)));
        setInvoices([]);
        Swal.fire("Deleted!", "All invoices removed.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete all invoices.", "error");
      }
    }
  };

  if (loading) return null; 
  if (!client) return <div className="text-center mt-20 font-bold">Client not found!</div>;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-[#1E293B]">
      <div className="bg-white rounded-[24px] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[95vh] border border-gray-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800 uppercase leading-tight">{client.name}</h2>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Customer Profile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/invoices/create?clientId=${client.id}`)} 
              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              title="Create Invoice"
            >
              <Plus size={20}/>
            </button>
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-gray-50/30">
          
          {/* Info Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border transition-all ${editMode ? 'bg-white border-blue-400 shadow-sm' : 'bg-[#F1F5F9] border-gray-200'}`}>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase mb-1">
                  <User size={10}/> Name
                </label>
                <input 
                  value={client.name} 
                  disabled={!editMode} 
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  className="w-full bg-transparent font-bold text-gray-800 text-[13px] outline-none" 
                />
              </div>
              <div className={`p-4 rounded-xl border transition-all ${editMode ? 'bg-white border-blue-400 shadow-sm' : 'bg-[#F1F5F9] border-gray-200'}`}>
                <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase mb-1">
                  <Phone size={10}/> Phone
                </label>
                <input 
                  type="text"
                  maxLength="10"
                  value={client.phone} 
                  disabled={!editMode} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); 
                    setClient({ ...client, phone: val });
                  }}
                  className="w-full bg-transparent font-bold text-gray-800 text-[13px] outline-none" 
                  placeholder="10 digit number"
                />
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${editMode ? 'bg-white border-blue-400 shadow-sm' : 'bg-[#F1F5F9] border-gray-200'}`}>
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase mb-1">
                <Mail size={10}/> Email Address
              </label>
              <input 
                value={client.email} 
                disabled={!editMode} 
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                className="w-full bg-transparent font-bold text-gray-800 text-[13px] outline-none" 
              />
            </div>

            <div className={`p-4 rounded-xl border transition-all ${editMode ? 'bg-white border-blue-400 shadow-sm' : 'bg-[#F1F5F9] border-gray-200'}`}>
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase mb-1">
                <MapPin size={10}/> Billing Address
              </label>
              <textarea 
                value={client.address || ""} 
                disabled={!editMode} 
                onChange={(e) => setClient({ ...client, address: e.target.value })}
                className="w-full bg-transparent font-bold text-gray-800 text-[13px] outline-none min-h-[50px] resize-none" 
              />
            </div>
          </div>

          {/* Invoices History */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Transaction History</h3>
              <div className="flex items-center gap-3">
                {invoices.length > 0 && (
                  <button 
                    onClick={deleteAllInvoices}
                    className="text-[9px] font-black text-red-500 hover:text-red-700 uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-lg transition-all"
                  >
                    Delete All
                  </button>
                )}
                <span className="text-[10px] font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-full">{invoices.length} Invoices</span>
              </div>
            </div>

            <div className="space-y-2">
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <div 
                    key={inv.id} 
                    onClick={() => {
                      if (inv.pdfUrl) {
                        window.open(inv.pdfUrl, "_blank");
                      } else {
                        Swal.fire("Information", "PDF link not found for this invoice.", "info");
                      }
                    }}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer group transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-colors">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-gray-800 uppercase">{inv.invoiceNumber || `#${inv.id}`}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          {new Date(inv.invoiceDate).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[13px] font-black text-gray-800">₹{inv.grandTotal.toLocaleString()}</p>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                          inv.paymentStatus === 'PAID' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {inv.paymentStatus}
                        </span>
                      </div>
                      {/* Individual Delete Button */}
                      <button 
                        onClick={(e) => deleteSingleInvoice(e, inv.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                  <FileText size={24} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase">No invoices found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
          <button onClick={handleDelete} className="p-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colour shadow-sm">
            <Trash2 size={20}/>
          </button>
          
          <div className="flex gap-2">
             {!editMode ? (
               <button 
                onClick={() => setEditMode(true)} 
                className="px-6 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 font-black text-[11px] uppercase rounded-xl hover:bg-gray-100 transition-all"
               >
                Edit Profile
               </button>
             ) : (
               <>
                <button onClick={() => setEditMode(false)} className="px-4 py-2.5 text-red-500 font-black text-[11px] uppercase hover:bg-red-50 rounded-xl transition-all">Cancel</button>
                <button 
                  onClick={handleUpdate} 
                  className="px-6 py-2.5 bg-green-600 text-white font-black rounded-xl text-[11px] uppercase shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                >
                  Save Changes
                </button>
                </>
             )}
             <button 
              onClick={() => navigate(-1)} 
              className="px-6 py-2.5  bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
             >
              Close
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;