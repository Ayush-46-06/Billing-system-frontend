import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2";
import api from "../api/axios";
import { Mail, UserCog, Trash2, ArrowRight } from "lucide-react";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchManagers = async () => {
    try {
      const res = await api.get("/api/admin/managers");
      setManagers(res.data || []);
    } catch (err) {
      console.error(err);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const deleteManager = async (e, id) => {
    e.stopPropagation(); 
    const confirm = await Swal.fire({
      title: "Delete Manager?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/admin/managers/${id}`);
      Swal.fire("Deleted!", "Manager has been removed", "success");
      fetchManagers();
    } catch (err) {
      Swal.fire("Error", "Failed to delete the manager", "error");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-black text-gray-800 mb-1">Managers</h1>
      <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1 mb-6">
        Manage system managers and permissions
      </p>

      {loading && (
        <p className="text-gray-400 text-center mt-10 font-bold">Loading managers...</p>
      )}

      {!loading && managers.length === 0 && (
        <p className="text-gray-400 text-center mt-10 font-bold">No managers found</p>
      )}

      {!loading && managers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {managers.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/managers/${m.id}/invoices`, { state: { name: m.name } })}
              className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer border border-transparent hover:border-gray-200"
            >
              <div>
                <div className="flex items-center gap-7 mb-3">
                  
                  <div className="w-16 h-16 rounded-full border-2 border-gray-300 p-1">
                    <img
                      src={m.profileImage || "/avatar.png"}
                      onError={(e) => (e.target.src = "/avatar.png")}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-lg text-gray-800 truncate">{m.name}</h2>

                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-blue-500" />
                        <p className="text-sm text-gray-500 truncate">{m.email}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <UserCog size={14} className="text-purple-500" />
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">{m.role}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                      <p className="text-sm text-gray-500">
                        {m.department || "No Department"}
                      </p>
                     </div>
                    </div>
                  </div>

                </div>
              </div>

              <div>
                <div className="border-t border-gray-100 my-3"></div>
                <div className="flex justify-between items-center">
                  
                  <div className="flex items-center gap-2">
                    {m.role === "MANAGER" && (
                      <button
                        onClick={(e) => deleteManager(e, m.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      Manager Data
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/managers/${m.id}/invoices`, { state: { name: m.name } });
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Managers;