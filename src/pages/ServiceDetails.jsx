import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import { ArrowLeft, Trash2, Edit3, Save, Package, IndianRupee, AlignLeft, X, CheckCircle2, AlertCircle } from "lucide-react";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    basePrice: "",
    active: "ACTIVE",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/api/services/fetch/${id}`);
        setService(res.data);
        setForm({
          serviceName: res.data.serviceName || "",
          description: res.data.description || "",
          basePrice: res.data.basePrice || "",
          active: res.data.active || "ACTIVE",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text: "Unable to retrieve service details. Please try again later.",
          confirmButtonColor: "#1E293B"
        });
      }
    };
    fetchService();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const payload = {
        serviceName: form.serviceName,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
        active: form.active
      };

      const res = await api.put(`/api/services/update/${id}`, payload);

      if (res.status === 200 || res.status === 204) {
        Swal.fire({ 
          icon: "success", 
          title: "Service Updated", 
          text: "The changes have been saved successfully.",
          timer: 1500, 
          showConfirmButton: false 
        });
        setService({ ...service, ...form });
        setEditMode(false);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while saving changes. Please check your connection.",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. This service will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete Service",
      cancelButtonText: "Cancel"
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/services/delete/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "The service has been removed from the catalog.",
        timer: 1500,
        showConfirmButton: false
      });
      navigate("/services");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "This service could not be deleted. It might be linked to existing records.",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Details...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  p-4 md:p-12 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all duration-500">
        
        {/* HEADER SECTION */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/services")} className="p-2.5 bg-gray-300 hover:bg-blue-500 hover:text-white rounded-full transition-all text-black border border-gray-100 shadow-lg">
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Service Management</p>
              <h1 className="text-lg font-black text-[#1E293B] uppercase tracking-tight leading-none">
                {editMode ? "Configure Service" : service.serviceName}
              </h1>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black text-[9px] uppercase tracking-tighter ${
            form.active === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {form.active === 'ACTIVE' ? <CheckCircle2 size={10}/> : <AlertCircle size={10}/>}
            {form.active}
          </div>
        </div>

        <div className="p-8 space-y-6">
          
          {/* INPUT FIELDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Identity</label>
              <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${editMode ? 'border-blue-500 bg-white ring-4 ring-blue-50' : 'border-gray-100 bg-gray-50/50'}`}>
                <Package size={18} className={editMode ? "text-blue-500" : "text-gray-400"} />
                <input
                  disabled={!editMode}
                  value={form.serviceName}
                  onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                  className="w-full bg-transparent font-bold text-[#1E293B] text-[13px] outline-none uppercase placeholder:text-gray-300"
                  placeholder="Service Name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Price (INR)</label>
              <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${editMode ? 'border-blue-500 bg-white ring-4 ring-blue-50' : 'border-gray-100 bg-gray-50/50'}`}>
                <IndianRupee size={18} className={editMode ? "text-blue-500" : "text-gray-400"} />
                <input
                  disabled={!editMode}
                  type="number"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full bg-transparent font-bold text-[#1E293B] text-[13px] outline-none placeholder:text-gray-300"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* STATUS TOGGLE */}
          {editMode && (
            <div className="p-4 rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div>
                <p className="text-[10px] font-black text-blue-900 uppercase">Availability Status</p>
                <p className="text-[11px] font-medium text-blue-600/70">Current: {form.active}</p>
              </div>
              <button
                onClick={() => setForm({ ...form, active: form.active === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}
                className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase transition-all shadow-sm ${
                  form.active === "ACTIVE" ? "bg-green-500 text-white shadow-green-100 hover:bg-green-600" : "bg-red-500 text-white shadow-red-100 hover:bg-red-600"
                }`}
              >
                Switch to {form.active === "ACTIVE" ? "Inactive" : "Active"}
              </button>
            </div>
          )}

          {/* DESCRIPTION BOX */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Details & Scope</label>
            <div className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${editMode ? 'border-blue-500 bg-white ring-4 ring-blue-50' : 'border-gray-100 bg-gray-50/50'}`}>
              <AlignLeft size={18} className={`mt-1 ${editMode ? "text-blue-500" : "text-gray-400"}`} />
              <textarea
                disabled={!editMode}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-transparent font-semibold text-[#64748B] text-[12px] outline-none min-h-[120px] resize-none leading-relaxed"
                placeholder="Enter service description here..."
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50">
            {!editMode ? (
              <button 
                onClick={handleDelete} 
                className="group flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <div className="p-2 bg-red-50 group-hover:bg-red-100 rounded-lg transition-all">
                  <Trash2 size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Terminate Service</span>
              </button>
            ) : <div className="hidden sm:block" />}

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)} 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setEditMode(false)} 
                    className="flex-1 sm:flex-none px-8 py-3.5 bg-white text-gray-400 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleUpdate} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                  >
                    <Save size={14} /> Update
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;