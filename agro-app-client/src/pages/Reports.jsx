function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-400">
        📈 Reports
      </h1>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-gray-400">Today Revenue</p>
          <h2 className="text-3xl font-bold mt-2">₹4,250</h2>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-gray-400">Monthly Revenue</p>
          <h2 className="text-3xl font-bold mt-2">₹78,000</h2>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-gray-400">Pending Credits</p>
          <h2 className="text-3xl font-bold mt-2 text-red-400">
            ₹12,300
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Reports;