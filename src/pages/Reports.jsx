import { useEffect, useState } from "react";
import { getInvoices } from "../api/invoice";
import { FileText, Download, TrendingUp, BarChart3 } from "lucide-react";

const Reports = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getInvoices();
        setInvoices(res.data || []);
      } catch (err) {
        console.error("Reports loading error", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  const totalTax = invoices.reduce((sum, inv) => sum + (inv.taxTotal || 0), 0);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Invoice No,Client,Date,Amount,Status\n"
      + invoices.map(i => `${i.invoiceNumber},${i.clientName},${i.invoiceDate},${i.grandTotal},${i.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "billing_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div className="p-10 text-center font-bold text-blue-600">Loading Reports...</div>;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#1E293B]">Financial Reports</h1>
            <p className="text-gray-400 text-sm font-medium">Analyze your business performance</p>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-[#1E293B] rounded-xl font-bold shadow-sm hover:bg-gray-50">
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><TrendingUp size={20}/></div>
            <p className="text-gray-400 text-[10px] font-bold uppercase">Total Billing</p>
            <h2 className="text-2xl font-black text-[#1E293B]">₹{totalRevenue.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4"><FileText size={20}/></div>
            <p className="text-gray-400 text-[10px] font-bold uppercase">Total Invoices</p>
            <h2 className="text-2xl font-black text-[#1E293B]">{invoices.length}</h2>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><BarChart3 size={20}/></div>
            <p className="text-gray-400 text-[10px] font-bold uppercase">Tax Collected</p>
            <h2 className="text-2xl font-black text-[#1E293B]">₹{totalTax.toLocaleString()}</h2>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#1E293B] mb-6 px-2">Recent Report Data</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 px-2">Month</th>
                <th className="pb-4">Invoices</th>
                <th className="pb-4">Taxable Amt</th>
                <th className="pb-4 text-right px-2">Net Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-5 px-2 font-bold">April 2026</td>
                <td className="py-5 font-medium">{invoices.length}</td>
                <td className="py-5 font-medium text-gray-500">₹{(totalRevenue - totalTax).toLocaleString()}</td>
                <td className="py-5 text-right px-2 font-black text-blue-600">₹{totalRevenue.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;