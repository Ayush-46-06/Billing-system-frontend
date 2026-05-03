import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowRight, MapPin, Phone, Mail, Plus, X } from "lucide-react";

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/clients");
      setCustomers(res.data || []);
      setFilteredCustomers(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch customers", "error");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      return Swal.fire("Error", "Select both dates", "warning");
    }
    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    const filtered = customers.filter((c) => {
      const created = new Date(c.createdAt);
      return created >= start && created <= end;
    });
    setFilteredCustomers(filtered);
  };

  const handleReset = () => {
    setFilteredCustomers(customers);
    setFromDate("");
    setToDate("");
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.phone) {
      return Swal.fire("Missing Fields", "Name, Email and Phone required", "warning");
    }
    if (!/^\d{10}$/.test(form.phone)) {
      return Swal.fire("Invalid Input", "Phone must be 10 digits", "error");
    }

    try {
      Swal.fire({ title: "Creating client...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await api.post("/api/clients", form);
      await fetchCustomers();
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", address: "" });
      Swal.fire("Success", "Client created", "success");
    } catch (err) {
      Swal.fire("Error", "Failed", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Customers Directory</h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-1 mb-6">Manage your clients and track billing.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* 1. ADD NEW CLIENT CARD */}
          <div
            onClick={() => setShowForm(true)}
            className="border-2 border-dashed border-gray-300 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-300 transition p-4 min-h-[160px]"
          >
            <div className="text-2xl text-blue-400 bg-blue-50 w-10 h-10 flex items-center justify-center rounded-full mb-2">＋</div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Add New Client</p>
          </div>

          {/* 2. CUSTOMERS LIST  */}
          {filteredCustomers.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-[24px] shadow-sm hover:shadow-md transition flex flex-col justify-between border border-gray-50 min-h-[160px]">
              <div>
                <div className="flex justify-between mb-3">
                  <h2 className="font-black text-[13px] text-gray-800 uppercase truncate pr-2">{c.name}</h2>
                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-green-100 text-green-600 rounded-md uppercase shrink-0 h-fit">ACTIVE</span>
                </div>
                
                <div className="space-y-1.5 mb-3">
                  <p className="text-[10px] font-bold text-gray-500 flex items-center gap-2 truncate">
                    <Mail size={12} className="text-blue-500 shrink-0" /> {c.email}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                    <Phone size={12} className="text-blue-500 shrink-0" /> {c.phone}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 flex items-start gap-2 italic line-clamp-1">
                    <MapPin size={12} className="text-red-400 shrink-0" /> 
                    {c.address || "No address provided"}
                  </p>
                </div>
              </div>

              <div>
                <div className="border-t border-gray-50 my-3"></div>
                <div className="flex justify-between items-center">
                  <p className="text-[8px] text-gray-300 uppercase font-black tracking-widest">client data</p>
                  <button
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- ADD CLIENT MODAL --- */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col">

              {/* HEADER */}
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black text-[#1E293B] uppercase leading-tight">Create Client</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Client Details</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={20}/>
                </button>
              </div>

              {/* FORM */}
              <div className="p-6 space-y-4">
                <div className="p-3 bg-gray-100 rounded-2xl border border-gray-300 focus-within:border-blue-500/30 focus-within:bg-white transition-all">
                  <label className="text-[8px] font-black text-gray-400 uppercase block mb-0.5">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent font-bold text-[#1E293B] text-xs outline-none uppercase"
                    placeholder="CLIENT NAME"
                  />
                </div>

                <div className="p-3 bg-gray-100 rounded-2xl border border-gray-300 focus-within:border-blue-500/30 focus-within:bg-white transition-all">
                  <label className="text-[8px] font-black text-gray-400 uppercase block mb-0.5">Email Address</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent font-bold text-[#1E293B] text-xs outline-none"
                    placeholder="EMAIL"
                  />
                </div>

                <div className="p-3 bg-gray-100 rounded-2xl border border-gray-300 focus-within:border-blue-500/30 focus-within:bg-white transition-all">
                  <label className="text-[8px] font-black text-gray-400 uppercase block mb-0.5">Phone Number</label>
                  <input
                    value={form.phone}
                    maxLength="10"
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                    className="w-full bg-transparent font-bold text-[#1E293B] text-xs outline-none"
                    placeholder="NUMBER"
                  />
                </div>

                <div className="p-3 bg-gray-100 rounded-2xl border border-gray-300 focus-within:border-blue-500/30 focus-within:bg-white transition-all">
                  <label className="text-[8px] font-black text-gray-400 uppercase block mb-0.5">Billing Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-transparent font-bold text-[#1E293B] text-xs outline-none min-h-[60px] resize-none"
                    placeholder="ADDRESS"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="p-6 border-t border-gray-50 flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-white text-[#1E293B] border border-gray-100 font-bold rounded-xl text-[10px] uppercase hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-[2] py-3 bg-[#0052CC] text-white font-bold rounded-xl text-[10px] uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  Add Client
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;