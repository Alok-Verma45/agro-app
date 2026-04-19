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
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const sortedPending = [...pendingList].sort(
    (a, b) => b.pendingAmount - a.pendingAmount
  );

  return (
    <div className="py-6 space-y-6 animate-fadeIn">

      {/* 🔥 HEADING */}
      <h1 className="text-2xl sm:text-3xl font-bold text-green-400">
        📊 डैशबोर्ड (Dashboard)
      </h1>

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {[
          {
            label: "कुल ग्राहक (Total Customers)",
            value: customers.length,
            color: "",
            icon: "👥",
          },
          {
            label: "कुल बिक्री (Total Sales)",
            value: `₹${dashboard.totalCredit || 0}`,
            color: "text-blue-400",
            icon: "💰",
          },
          {
            label: "प्राप्त राशि (Amount Received)",
            value: `₹${dashboard.totalPaid || 0}`,
            color: "text-green-400",
            icon: "💵",
          },
          {
            label: "बकाया राशि (Pending Amount)",
            value: `₹${dashboard.totalPending || 0}`,
            color: "text-red-400",
            icon: "⚠️",
            highlight: dashboard.totalPending > 0,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-xl 
            border border-white/10 
            hover:border-green-400/30 
            hover:shadow-green-500/10 
            transition-all duration-300 
            hover:scale-[1.02]
            p-5 rounded-2xl shadow-lg"
          >
            <p className="text-gray-400 text-sm flex items-center gap-2">
              {card.icon} {card.label}
            </p>

            <h2
              className={`text-3xl font-bold mt-2 ${card.color} ${
                card.highlight ? "animate-pulse" : ""
              }`}
            >
              {loading ? "..." : card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* 🔥 TOP CUSTOMERS */}
      <div className="bg-white/5 backdrop-blur-xl 
      border border-white/10 
      p-6 rounded-2xl shadow-lg">

        <h2 className="text-xl font-semibold mb-4">
          ⭐ शीर्ष ग्राहक (Top Customers)
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : topCustomers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">
              🚫 कोई डेटा उपलब्ध नहीं
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (No data available)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-3 rounded-lg
                ${
                  i === 0
                    ? "bg-red-500/10 border border-red-400/20 font-semibold"
                    : "bg-white/5"
                } hover:scale-[1.02] transition`}
              >
                <span>{c.customerName}</span>
                <span className="text-red-400 font-semibold">
                  ₹{c.pendingAmount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 PENDING LIST */}
      <div className="bg-white/5 backdrop-blur-xl 
      border border-white/10 
      p-6 rounded-2xl shadow-lg">

        <h2 className="text-xl font-semibold mb-4">
          📉 बकाया विवरण (Pending Overview)
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : sortedPending.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">
              🚫 कोई डेटा उपलब्ध नहीं
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (No data available)
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {sortedPending.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-lg 
                bg-white/5 hover:scale-[1.02] transition"
              >
                <span>{c.customerName}</span>
                <span className="text-red-400 font-medium">
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