import { useEffect, useState } from "react";
import { getCustomers } from "../api/customerApi";
import {
  getDashboardData,
  getTopCustomers,
  getCustomerPending,
} from "../api/creditApi";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [topCustomers, setTopCustomers] = useState([]);
  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [custRes, dashRes, topRes, pendingRes] =
        await Promise.all([
          getCustomers(),
          getDashboardData(),
          getTopCustomers(),
          getCustomerPending(),
        ]);

      setCustomers(custRes.data);
      setDashboard(dashRes.data);
      setTopCustomers(topRes.data);
      setPendingList(pendingRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedPending = [...pendingList].sort(
    (a, b) => b.pendingAmount - a.pendingAmount
  );

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 HEADING */}
      <h1 className="text-3xl font-bold text-green-400">
        📊 डैशबोर्ड
      </h1>

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg 
        p-5 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            कुल ग्राहक 👥
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {customers.length}
          </h2>
        </div>

        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg 
        p-5 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            कुल बिक्री 💰
          </p>
          <h2 className="text-3xl font-bold text-blue-500 mt-2">
            ₹{dashboard.totalCredit || 0}
          </h2>
        </div>

        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg 
        p-5 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            प्राप्त राशि 💵
          </p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            ₹{dashboard.totalPaid || 0}
          </h2>
        </div>

        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg 
        p-5 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            बकाया राशि ⚠️
          </p>
          <h2 className="text-3xl font-bold text-red-500 mt-2">
            ₹{dashboard.totalPending || 0}
          </h2>
        </div>
      </div>

      {/* 🔥 TOP CUSTOMERS */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg 
      p-6 rounded-2xl shadow-lg border border-white/20">

        <h2 className="text-xl font-semibold mb-4">
          ⭐ शीर्ष ग्राहक
        </h2>

        {topCustomers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            कोई डेटा उपलब्ध नहीं
          </p>
        ) : (
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-3 rounded-lg
                ${
                  i === 0
                    ? "bg-red-100 dark:bg-red-900/30 font-semibold"
                    : "bg-white/60 dark:bg-gray-800"
                } hover:scale-[1.02] transition`}
              >
                <span>{c.customerName}</span>
                <span className="text-red-500 font-semibold">
                  ₹{c.pendingAmount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 PENDING LIST */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg 
      p-6 rounded-2xl shadow-lg border border-white/20">

        <h2 className="text-xl font-semibold mb-4">
          📉 बकाया विवरण
        </h2>

        {sortedPending.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            कोई डेटा उपलब्ध नहीं
          </p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {sortedPending.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-lg 
                bg-white/60 dark:bg-gray-800 hover:scale-[1.02] transition"
              >
                <span>{c.customerName}</span>
                <span className="text-red-500 font-medium">
                  ₹{c.pendingAmount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;