const Card = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-semibold mt-2">{value}</h2>
    </div>
  );
};

const DashboardCards = () => {
  return (
    <div>

      <h1 className="text-2xl font-semibold mb-6">
        The <span className="text-blue-600">Athenura</span> Live
      </h1>

      <div className="grid grid-cols-4 gap-4">

        <Card title="Total Revenue" value="$428,900" />
        <Card title="Paid Invoices" value="1,240" />
        <Card title="Pending" value="$34,200" />
        <Card title="Overdue" value="$8,450" />

      </div>

    </div>
  );
};

export default DashboardCards;