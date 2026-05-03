import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowRight, IndianRupee, Trash2, X, Package, AlertCircle, CheckCircle2 } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    basePrice: "",
    active: "ACTIVE",
  });

  const fetchServices = async () => {
    try {
      const res = await api.get("/api/services/fetch");
      setServices(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch services from the server.",
      });
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleCreate = async () => {
    if (!form.serviceName || !form.basePrice) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Service Name and Price are required.",
      });
    }
    try {
      const payload = {
        ...form,
        basePrice: parseFloat(form.basePrice),
        active: "ACTIVE" 
      };

      await api.post("/api/services/create", payload);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Service created successfully.",
        timer: 1500,
        showConfirmButton: false
      });
      fetchServices();
      setShowCreate(false);
      setForm({ serviceName: "", description: "", basePrice: "", active: "ACTIVE" });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create service. Please check your database.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this change!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`/api/services/delete/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The service has been removed.",
        timer: 1500,
        showConfirmButton: false
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the service.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Services</h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1 mb-6">Your catalog of offerings</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* CREATE NEW CARD */}
          <div
            onClick={() => setShowCreate(true)}
            className="border-2 border-dashed border-gray-300 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all p-4 min-h-[160px]"
          >
            <div className="text-2xl text-blue-500 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-full mb-2 shadow-sm">＋</div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">New Service</p>
          </div>

          {/* LISTING SERVICES */}
          {services.map((s) => (
            <div key={s.id} className={`bg-white p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col justify-between border ${s.active === 'INACTIVE' ? 'border-red-100 opacity-80' : 'border-gray-50'} min-h-[160px]`}>
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="font-black text-[13px] text-[#1E293B] uppercase truncate pr-2" title={s.serviceName}>{s.serviceName}</h2>
                  <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1 shrink-0 ${
                    s.active === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {s.active === 'ACTIVE' ? <CheckCircle2 size={8}/> : <AlertCircle size={8}/>}
                    {s.active}
                  </span>
                </div>
                
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-bold text-gray-600 italic break-words leading-relaxed">
                    {s.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <IndianRupee size={12} className="text-blue-500 shrink-0" />
                    <p className="text-[14px] font-black text-[#1E293B]">₹{Number(s.basePrice).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="border-t border-gray-50 my-3"></div>
                <div className="flex justify-between items-center">
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/services/${s.id}`)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                  <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE MODAL */}
        {showCreate && (
          <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] max-w-md w-full overflow-hidden flex flex-col border border-gray-200 shadow-2xl">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-base font-black text-[#1E293B] uppercase tracking-tighter">New Service</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Pricing & Specs</p>
                </div>
                <button onClick={() => setShowCreate(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={20}/>
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-3 bg-gray-100 rounded-2xl border border-gray-300 focus-within:border-blue-500 transition-all">
                  <label className="text-[8px] font-black text-gray-400 uppercase block mb-1 tracking-widest">Service Name</label>
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-blue-500" />
                    <input
                      value={form.serviceName}
                      onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                      className="w-full bg-transparent font-bold text-[#1E293B] text-xs outline-none uppercase"
                      placeholder="ENTER NAME"
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-100 rounded-2xl border border-gray-300 focus-within:border-blue-500 transition-all">
                  <label className="text-[8px] font-black text-gray-400 uppercase block mb-1 tracking-widest">Base Rate (₹)</label>
                  <div className="flex items-center gap-2">
                    <IndianRupee size={14} className="text-blue-500" />
                    <input
                      type="number"
                      value={form.basePrice}
                      onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                      className="w-full bg-transparent font-bold text-[#1E293B] text-xs outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-100 rounded-2xl border border-gray-300 focus-within:border-blue-500 transition-all">
                  <label className="text-[8px] font-black text-gray-400 uppercase block mb-1 tracking-widest">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-transparent font-bold text-[#1E293B] text-xs outline-none min-h-[60px] resize-none"
                    placeholder="ENTER DESCRIPTION"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-50 flex gap-3">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3 bg-white text-gray-500 border border-gray-200 font-black rounded-xl text-[10px] uppercase hover:bg-gray-100 transition-all">
                  Cancel
                </button>
                <button onClick={handleCreate} className="flex-[2] py-3 bg-[#0052CC] text-white font-black rounded-xl text-[10px] uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                  Add Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;