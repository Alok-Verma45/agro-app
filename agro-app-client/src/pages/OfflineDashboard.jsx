import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOfflineDashboard } from "../api/dashboardApi";

function OfflineDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCredit: 0,
    totalPaid: 0,
    totalPending: 0,
    topCustomers: [],
    pendingCustomers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await getOfflineDashboard();

      setStats({
        totalCustomers: res.data.totalCustomers || 0,
        totalCredit: res.data.totalCredit || 0,
        totalPaid: res.data.totalPaid || 0,
        totalPending: res.data.totalPending || 0,
        topCustomers: res.data.topCustomers || [],
        pendingCustomers: res.data.pendingCustomers || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sortedPending = [...stats.pendingCustomers].sort(
    (a, b) => b.pendingAmount - a.pendingAmount
  );

  const cards = [
    {
      title: "कुल ग्राहक",
      subtitle: "Total Customers",
      value: stats.totalCustomers,
      icon: "👥",
      color: "text-cyan-400",
    },
    {
      title: "कुल बिक्री",
      subtitle: "Total Sales",
      value: `₹${stats.totalCredit}`,
      icon: "💰",
      color: "text-blue-400",
    },
    {
      title: "प्राप्त राशि",
      subtitle: "Amount Received",
      value: `₹${stats.totalPaid}`,
      icon: "💵",
      color: "text-green-400",
    },
    {
      title: "बकाया राशि",
      subtitle: "Pending Amount",
      value: `₹${stats.totalPending}`,
      icon: "⚠️",
      color: "text-red-400",
    },
  ];

  const quickActions = [
    {
      label: "➕ Add Customer",
      onClick: () => navigate("/customers"),
    },
    {
      label: "📦 Add Product",
      onClick: () => navigate("/admin/products"),
    },
    {
      label: "🧾 Billing",
      onClick: () => navigate("/billing"),
    },
    {
      label: "💳 Credits",
      onClick: () => navigate("/credits"),
    },
  ];

  return (
    <div className="py-6 space-y-6 animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-green-400">
            📊 डैशबोर्ड
          </h1>

          <p className="text-gray-400 mt-1">
            Business overview & analytics
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-3">
          {quickActions.map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className="px-4 py-2 rounded-xl
              bg-white/5 border border-white/10
              hover:border-green-400/40
              hover:bg-green-500/10
              transition"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl p-5
            bg-white/5 backdrop-blur-xl
            border border-white/10
            hover:border-green-400/30
            hover:shadow-lg hover:shadow-green-500/10
            transition duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">
                  {card.icon} {card.title}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {card.subtitle}
                </p>

                <h2
                  className={`text-3xl font-bold mt-3 ${card.color}`}
                >
                  {loading ? "..." : card.value}
                </h2>
              </div>

              <span className="text-2xl opacity-70">
                {card.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* TOP CUSTOMERS */}
        <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">
            🏆 Top Customers
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : stats.topCustomers.length === 0 ? (
            <p className="text-gray-500">
              No customer data found
            </p>
          ) : (
            <div className="space-y-3">
              {stats.topCustomers.slice(0, 5).map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center
                  p-4 rounded-xl bg-white/5
                  hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-semibold">
                      {i === 0 && "🥇 "}
                      {i === 1 && "🥈 "}
                      {i === 2 && "🥉 "}
                      {c.customerName}
                    </p>

                    <p className="text-sm text-gray-400">
                      Priority Customer
                    </p>
                  </div>

                  <span className="text-red-400 font-bold">
                    ₹{c.pendingAmount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PENDING */}
        <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">
            📉 Pending Overview
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : sortedPending.length === 0 ? (
            <p className="text-gray-500">
              No pending balances
            </p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {sortedPending.slice(0, 8).map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5"
                >
                  <div className="flex justify-between mb-2">
                    <span>{c.customerName}</span>

                    <span
                      className={`font-semibold ${
                        c.pendingAmount === 0
                          ? "text-green-400"
                          : c.pendingAmount < 1000
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      ₹{c.pendingAmount}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-red-400"
                      style={{
                        width: `${Math.min(
                          c.pendingAmount / 50,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="rounded-2xl p-6
        bg-gradient-to-r from-green-500/10 to-blue-500/10
        border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              🚀 Business Growth Tip
            </h3>

            <p className="text-gray-400 mt-1">
              Recover pending payments regularly to improve monthly cash flow.
            </p>
          </div>

          <button
            onClick={() => navigate("/credits")}
            className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition text-white font-semibold"
          >
            Manage Credits
          </button>
        </div>
      </div>

    </div>
  );
}

export default OfflineDashboard;