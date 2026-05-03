const StatusBadge = ({ status }) => {
  const styles = {
    DRAFT: "bg-gray-100 text-gray-500 border-gray-200",
    PENDING: "bg-amber-100 text-amber-600 border-amber-200 animate-pulse", 
    SENT: "bg-blue-100 text-blue-600 border-blue-200",
    FAILED: "bg-red-100 text-red-600 border-red-200",
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200 font-black", 
  };

  const label = status === "PAID" ? "PAID" : status;

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${styles[status] || "bg-gray-50 text-gray-400"}`}>
      {label || "UNKNOWN"}
    </span>
  );
};

export default StatusBadge;