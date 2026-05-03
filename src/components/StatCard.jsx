const StatCard = ({ title, value, danger }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2
        className={`text-xl font-semibold ${
          danger ? "text-red-500" : "text-black"
        }`}
      >
        {value}
      </h2>
    </div>
  );
};

export default StatCard;