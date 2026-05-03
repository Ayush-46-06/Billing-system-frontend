import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axios";
import { Trash2, Plus } from "lucide-react";

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    percentage: ""
  });

  const fetchTaxes = async () => {
    try {
      const res = await api.get("/api/taxes");
      setTaxes(res.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load taxes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);


  const deleteTax = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Tax?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete"
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/taxes/${id}`);
      Swal.fire("Deleted", "", "success");
      fetchTaxes();
    } catch (err) {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-1 ">Tax Module</h1>
      <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1 mb-6">Manage your tax rates and configurations</p>

      {/* TAX GRID - Adjusted for smaller cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        {/* ADD TAX CARD (FIRST POSITION) */}
        <div
          onClick={() => setShowCreate(true)}
          className="border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition p-4 h-[160px] bg-white/50"
        >
          <div className="text-3xl text-blue-400 font-light">
            <Plus size={32} />
          </div>
          <p className="mt-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
            Add New Tax
          </p>
        </div>

        {/* EXISTING TAXES */}
        {taxes.map((tax) => (
          <div
            key={tax.id}
            className="bg-white rounded-3xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition h-[160px]"
          >
            <div>
              <h2 className="text-md font-bold text-gray-800 truncate">
                {tax.name}
              </h2>
              <div className="mt-2 text-[11px] text-gray-500 flex justify-between items-center bg-white p-2 rounded-xl">
                <span className="font-bold uppercase tracking-tighter">Percentage</span>
                <span className="font-black text-blue-600 text-sm">{tax.percentage}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-3 border-gray-50">
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Active</p>
               <button
                onClick={() => deleteTax(tax.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">
                  Create Tax
                </h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Tax Details
                </p>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-transparent focus-within:border-blue-100 transition-all">
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">
                  Tax Name
                </label>
                <input
                  autoFocus
                  placeholder="GST"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent font-bold text-sm outline-none border-none text-gray-700"
                />
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-transparent focus-within:border-blue-100 transition-all">
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">
                  Percentage (%)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.percentage}
                  onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                  className="w-full bg-transparent font-bold text-sm outline-none border-none text-gray-700"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-50 flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-black text-[10px] uppercase rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if(!form.name || !form.percentage) return Swal.fire("Error", "Fill all fields", "error");
                  try {
                    await api.post("/api/taxes", {
                      name: form.name,
                      percentage: Number(form.percentage),
                    });
                    Swal.fire("Success", "Tax created", "success");
                    setForm({ name: "", percentage: "" });
                    setShowCreate(false);
                    fetchTaxes();
                  } catch {
                    Swal.fire("Error", "Action failed", "error");
                  }
                }}
                className="flex-[2] py-3 bg-[#0052CC] text-white font-black text-[10px] uppercase rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Add Tax
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Taxes;