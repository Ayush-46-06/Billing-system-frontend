import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; 
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell
} from "recharts";


import {
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  IndianRupeeIcon,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [allInvoices, setAllInvoices] = useState([]); 
  const [viewMode, setViewMode] = useState("12 Months"); 
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/invoices/fetch");
        const invoices = res.data || [];
        setAllInvoices(invoices);

       const isPaid = (i) => i.paymentStatus?.toUpperCase() === "PAID";
        
        const revenue = invoices
          .filter(isPaid)
          .reduce((sum, i) => sum + (i.grandTotal || 0), 0);

        setStats({
          revenue,
          paid: invoices.filter(isPaid).length,
          pending: invoices.filter((i) => i.paymentStatus === "UNPAID").length,
          overdue: invoices.filter((i) => i.paymentStatus === "OVERDUE").length,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setStats({ revenue: 0, paid: 0, pending: 0, overdue: 0 });
      }
    };
    fetchData();
  }, []);

  const totalInvoices = allInvoices.length;

const paidInvoices = allInvoices.filter(
  (i) => i.paymentStatus?.toUpperCase() === "PAID"
).length;

const retentionRate = totalInvoices
  ? ((paidInvoices / totalInvoices) * 100).toFixed(1)
  : 0;

const avgPayCycle = 12; // keep static for now

const churnRate = totalInvoices
  ? (100 - retentionRate).toFixed(1)
  : 0;

  const chartData = useMemo(() => {
  const now = new Date();


  if (viewMode === "30 Days") {
    const days = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const dayStr = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      const total = allInvoices
        .filter(inv => {
          const invDate = new Date(inv.invoiceDate);
          return (
            invDate.getDate() === d.getDate() &&
            invDate.getMonth() === d.getMonth() &&
            invDate.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

      days.push({
        name: dayStr,
        revenue: total,
        isCurrent: i === 0,
      });
    }

    return days;
  }


  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return months.map((m, index) => {
    const total = allInvoices
      .filter(inv => new Date(inv.invoiceDate).getMonth() === index)
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

    return {
      name: m,
      revenue: total,
      isCurrent: index === now.getMonth(),
    };
  });

}, [allInvoices, viewMode]);

  const transactions = useMemo(() => {
    return [...allInvoices].sort((a, b) => b.id - a.id).slice(0, 5);
  }, [allInvoices]);

const handleDownload = () => {
  const formattedData = allInvoices.map((inv, index) => ({
    "No.": index + 1,
    "Invoice Number": inv.invoiceNumber,
    "Client Name": inv.clientName,
    "Date": new Date(inv.invoiceDate).toLocaleDateString("en-GB"),
    "Amount (₹)": inv.grandTotal,
    "Status": inv.paymentStatus,
    "Created By": inv.createdBy,
    "Services": inv.items?.map(i => i.serviceName).join(", ")
  }));


  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  const columnWidths = Object.keys(formattedData[0]).map(key => ({
    wch: key.length + 10
  }));
  worksheet["!cols"] = columnWidths;

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    worksheet[cellAddress].s = {
      font: { bold: true },
    };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "Athenura_Report.xlsx");
};

  if (!stats) return <div className="p-20 text-center font-black text-blue-600 animate-pulse text-2xl">ATHENURA IS LOADING...</div>;

  return (
    <div className=" min-h-screen p-4 md:p-2 font-sans">
      <div className="max-w-[1300px] mx-auto">
        
        <div className="mb-8">
          <p className="text-[10px] font-bold text-gray-400 tracking-[2px] uppercase">Overview Dashboard</p>
          <h1 className="text-3xl font-black text-[#1E293B] mt-1">
           <span className="text-2xl font-semibold">The </span> <span className="text-[#2563EB] text-2xl font-semibold border-b-4 border-[#2563EB]">Athenura</span> <span className="text-2xl font-semibold">Live</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Revenue", val: `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupeeIcon/>, color: "text-blue-600", bg: "bg-blue-50", trend: "+12.4%" },
            { label: "Paid Invoices", val: stats.paid, icon: <CheckCircle/>, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Pending", val: stats.pending, icon: <Clock/>, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Overdue", val: stats.overdue, icon: <AlertCircle/>, color: "text-red-600", bg: "bg-red-50" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 transition-transform hover:scale-105">
              <div className="flex justify-between items-center mb-4">
                <div className={`${item.bg} ${item.color} p-2.5 rounded-xl`}>{item.icon}</div>
                {item.trend && <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">{item.trend}</span>}
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
              <h2 className="text-2xl font-bold text-[#1E293B] mt-1">{item.val}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">Revenue Growth</h3>
                <p className="text-xs text-gray-400 font-medium">Real-time performance metrics</p>
              </div>
              
              <div className="flex bg-gray-100 p-1 rounded-xl text-[10px] font-bold">
                <button onClick={() => setViewMode("12 Months")} className={`px-4 py-2 rounded-lg ${viewMode === "12 Months" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}>12 Months</button>
                <button onClick={() => setViewMode("30 Days")} className={`px-4 py-2 rounded-lg ${viewMode === "30 Days" ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}>30 Days</button>
              </div>
            </div>

           <div className="overflow-x-auto">
  <div className={viewMode === "30 Days" ? "min-w-[1200px]" : "min-w-[700px]"}>
    
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        
        <XAxis
          dataKey="name"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fill: "#94A3B8", fontSize: 9, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip cursor={{ fill: "#f8fafc" }} />

        <Bar dataKey="revenue" radius={[10, 10, 10, 10]} barSize={30}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isCurrent ? "#1900ff" : "#2200ff"}
            />
          ))}
        </Bar>

      </BarChart>
    </ResponsiveContainer>

  </div>
</div>
          </div>

          <div className="bg-[#EEF2F7] p-6 rounded-[32px] border border-white flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1E293B] mb-1">Quick Stats</h3>
              <p className="text-xs text-gray-500 mb-8 font-medium">Business health check</p>
              <div className="space-y-7">
                <StatItem 
  label="Retention Rate" 
  val={`${retentionRate}%`} 
  sub="Based on paid invoices" 
/>

<StatItem 
  label="Avg. Pay Cycle" 
  val={`${avgPayCycle}d`} 
  sub="Estimated" 
/>

<StatItem 
  label="Churn Rate" 
  val={`${churnRate}%`} 
  sub="Unpaid vs total" 
/>
              </div>
            </div>
            <button onClick={handleDownload} className="mt-8 w-full py-4 bg-white text-[#1E293B] font-bold text-xs rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm">
              <Download size={16}/> Download Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-7">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1E293B]">Recent Transactions</h3>
            <button onClick={() => navigate("/invoices")} className="text-[#2563EB] text-xs font-bold">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase font-black border-b border-gray-50 tracking-widest">
                  <th className="pb-4 text-center px-4">Date</th>
                  <th className="pb-4 text-center px-4">Created By</th>
                  <th className="pb-4 text-center px-4">Client</th>
                  <th className="pb-4 text-center px-4">Services</th>
                  <th className="pb-4 text-center px-4">Status</th>
                  <th className="pb-4 text-center px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((inv) => (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-gray-50/50 cursor-pointer group transition-colors" 
                    onClick={() => navigate("/invoices")}
                  >
                    <td className="py-5 text-center px-4 font-bold text-sm text-[#1E293B]">
                      {new Date(inv.invoiceDate).toLocaleDateString('en-GB')}
                    </td>

                    <td className="py-5 text-center px-4">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-[#1E293B]">
                          {inv.createdBy || "System"}
                        </span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase mt-1 ${
                          inv.createdByRole === 'ROLE_ADMIN' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-blue-100 text-blue-600'
                        }`}>
                          {inv.createdByRole?.replace("ROLE_", "") || "USER"}
                        </span>
                      </div>
                    </td>

                    <td className="py-5 text-center px-4 font-bold text-sm text-[#1E293B]">
                      {inv.clientName}
                    </td>

                    <td className="py-5 text-center px-4 font-bold text-sm text-[#1E293B]">
                      {inv.items && inv.items.length > 0 ? (
                        inv.items.map(item => item.serviceName || "Service").join(", ")
                      ) : (
                        <span className="text-gray-300 italic font-normal">No services</span>
                      )}
                    </td>

                    <td className="py-5 text-center px-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase inline-block ${
                        inv.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-600"
                          : inv.paymentStatus === "OVERDUE"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {inv.paymentStatus || "UNPAID"}
                      </span>
                    </td>
                    
                    <td className="py-5 text-center px-4 font-black text-[#1E293B]">
                      ₹{inv.grandTotal?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, val, sub }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[11px] font-black text-blue-600">{val}</div>
    <div>
      <p className="text-sm font-bold text-[#1E293B]">{label}</p>
      <p className="text-[10px] text-gray-400">{sub}</p>
    </div>
  </div>
);

export default Dashboard;