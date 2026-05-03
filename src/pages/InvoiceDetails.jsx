import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import { X, FileText, Trash2, CheckCircle, Clock } from "lucide-react";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(`/api/invoices/fetch/${id}`);
      setInvoice(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load invoice details", "error");
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleUpdate = async () => {
    try {
      Swal.fire({ 
        title: "Saving Changes...", 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
      });

      // Handle Payment Status logic
      if (invoice.paymentStatus === "PAID") {
        try {
          await api.post(`/api/payments/pay/${id}`);
        } catch (payErr) {
          console.error("Payment sync failed, proceeding with update...");
        }
      }

      const payload = {
        id: id,
        clientId: invoice.clientId || (invoice.client ? invoice.client.id : null),
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        taxType: invoice.taxType,
        status: invoice.status,
        paymentStatus: invoice.paymentStatus, 
        items: invoice.items.map((item) => ({ 
          serviceId: item.serviceId || item.id 
        })),
      };

      await api.put(`/api/invoices/update/${id}`, payload);
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Changes saved successfully",
        timer: 1500,
        showConfirmButton: false
      });
      
      setEditMode(false);
      fetchInvoice(); 
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire("Error", "Failed to save updates.", "error");
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete this invoice?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it"
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/invoices/delete/${id}`);
        navigate("/invoices");
      } catch {
        Swal.fire("Error", "Delete request failed", "error");
      }
    }
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-800">{invoice.invoiceNumber || `#${invoice.id}`}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manage Invoice</p>
          </div>
          <div className="flex gap-2">
            {invoice.pdfUrl && (
              <a href={invoice.pdfUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                <FileText size={18}/>
              </a>
            )}
            <button onClick={() => navigate(-1)} className="p-2.5 bg-white text-gray-400 rounded-full border border-gray-100 hover:text-red-500">
              <X size={18}/>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {/* Client Name - Display Only */}
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Client Name</p>
              <p className="font-bold text-gray-700">{invoice.clientName || invoice.client?.name || "N/A"}</p>
            </div>
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Total Amount</p>
              <p className="font-black text-blue-700 text-lg">₹{invoice.grandTotal?.toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Status Toggle */}
          <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <p className="text-[9px] font-black text-gray-400 uppercase mb-3 ml-1">Payment Status</p>
            {editMode ? (
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setInvoice({ ...invoice, paymentStatus: "PAID" })}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm transition-all ${
                    invoice.paymentStatus === "PAID" ? "bg-green-600 text-white shadow-md" : "bg-gray-50 text-gray-400 border border-gray-100"
                  }`}
                >
                  <CheckCircle size={16} /> Paid
                </button>
                <button 
                  type="button"
                  onClick={() => setInvoice({ ...invoice, paymentStatus: "UNPAID" })}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm transition-all ${
                    invoice.paymentStatus !== "PAID" ? "bg-yellow-500 text-white shadow-md" : "bg-gray-50 text-gray-400 border border-gray-100"
                  }`}
                >
                  <Clock size={16} /> Unpaid
                </button>
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider ${
                invoice.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {invoice.paymentStatus === "PAID" ? <CheckCircle size={14}/> : <Clock size={14}/>}
                {invoice.paymentStatus}
              </div>
            )}
          </div>

          {/* Dates Section*/}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">Invoice Date</p>
              <input 
                type="date" 
                value={invoice.invoiceDate ? invoice.invoiceDate.split('T')[0] : ""} 
                disabled={!editMode} 
                onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
                className={`w-full p-3 border-none rounded-xl text-sm font-bold outline-none transition-all ${
                  editMode ? 'ring-2 ring-blue-500/20 bg-white shadow-sm' : 'bg-gray-50 text-gray-600'
                }`} 
              />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 ml-1">Due Date</p>
              <input 
                type="date" 
                value={invoice.dueDate ? invoice.dueDate.split('T')[0] : ""} 
                disabled={!editMode} 
                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                className={`w-full p-3 border-none rounded-xl text-sm font-bold outline-none transition-all ${
                  editMode ? 'ring-2 ring-blue-500/20 bg-white shadow-sm' : 'bg-gray-50 text-gray-600'
                }`} 
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <button onClick={handleDelete} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all">
            <Trash2 size={20}/>
          </button>
          
          <div className="flex gap-2">
             {!editMode ? (
               <button onClick={() => setEditMode(true)} className="px-6 py-2.5 bg-white text-gray-600 border border-gray-200 font-bold rounded-xl text-[10px] uppercase hover:bg-gray-100 transition-all">Edit</button>
             ) : (
               <>
                <button onClick={() => { setEditMode(false); fetchInvoice(); }} className="px-6 py-2.5 bg-gray-100 text-gray-500 font-bold rounded-xl text-[10px] uppercase hover:bg-gray-200 transition-all">Cancel</button>
                <button onClick={handleUpdate} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-[10px] uppercase shadow-lg shadow-blue-200 active:scale-95 transition-all">Save Changes</button>
               </>
             )}
             <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;