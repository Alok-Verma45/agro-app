import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOnlineDashboard } from "../api/dashboardApi";

function OnlineDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getOnlineDashboard();
      setDashboard(res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = dashboard.totalOrders || 0;

  const cards = [
    {
      title: "Total Users",
      subtitle: "Registered Customers",
      value: dashboard.totalUsers || 0,
      icon: "👥",
      color: "text-cyan-400",
    },
    {
      title: "Total Orders",
      subtitle: "All Orders",
      value: dashboard.totalOrders || 0,
      icon: "📦",
      color: "text-blue-400",
    },
    {
      title: "Products",
      subtitle: "Live Catalog",
      value: dashboard.totalProducts || 0,
      icon: "🛍️",
      color: "text-purple-400",
    },
    {
      title: "Revenue",
      subtitle: "Delivered Orders",
      value: `₹${dashboard.totalRevenue || 0}`,
      icon: "💰",
      color: "text-green-400",
    },
  ];

  const quickActions = [
    {
      label: "📬 Orders",
      onClick: () => navigate("/admin/orders"),
    },
    {
      label: "🧑‍💼 Users",
      onClick: () => navigate("/admin/users"),
    },
    {
      label: "📦 Products",
      onClick: () => navigate("/products"),
    },
  ];

  const statusList = [
    {
      label: "Placed",
      value: dashboard.placedOrders || 0,
      color: "bg-blue-500",
      text: "text-blue-400",
    },
    {
      label: "Confirmed",
      value: dashboard.confirmedOrders || 0,
      color: "bg-cyan-500",
      text: "text-cyan-400",
    },
    {
      label: "Shipped",
      value: dashboard.shippedOrders || 0,
      color: "bg-yellow-500",
      text: "text-yellow-400",
    },
    {
      label: "Delivered",
      value: dashboard.deliveredOrders || 0,
      color: "bg-green-500",
      text: "text-green-400",
    },
    {
      label: "Cancelled",
      value: dashboard.cancelledOrders || 0,
      color: "bg-red-500",
      text: "text-red-400",
    },
  ];

  return (
    <div className="py-6 space-y-6 animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-green-400">
            🌐 Online Dashboard
          </h1>

          <p className="text-gray-400 mt-1">
            Ecommerce overview & analytics
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {quickActions.map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-green-400/40 hover:bg-green-500/10 transition"
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
            className="rounded-2xl p-5 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-400/30 hover:shadow-lg hover:shadow-green-500/10 transition"
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  {card.icon} {card.title}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {card.subtitle}
                </p>

                <h2 className={`text-3xl font-bold mt-3 ${card.color}`}>
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

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* ORDER STATUS */}
        <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10">

          <h2 className="text-xl font-semibold mb-5">
            📈 Order Status
          </h2>

          <div className="space-y-4">
            {statusList.map((item, i) => {
              const width =
                totalOrders === 0
                  ? 0
                  : (item.value / totalOrders) * 100;

              return (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{item.label}</span>

                    <span className={`font-semibold ${item.text}`}>
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUICK INSIGHTS */}
        <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10">

          <h2 className="text-xl font-semibold mb-5">
            ⚡ Quick Insights
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Pending Orders</span>
              <span className="text-yellow-400 font-bold">
                {(dashboard.placedOrders || 0) +
                  (dashboard.confirmedOrders || 0) +
                  (dashboard.shippedOrders || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivered Orders</span>
              <span className="text-green-400 font-bold">
                {dashboard.deliveredOrders || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Cancelled Orders</span>
              <span className="text-red-400 font-bold">
                {dashboard.cancelledOrders || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Conversion Rate</span>
              <span className="text-cyan-400 font-bold">
                {totalOrders === 0
                  ? "0%"
                  : `${Math.round(
                      ((dashboard.deliveredOrders || 0) /
                        totalOrders) *
                        100
                    )}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER PANEL */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-white/10">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h3 className="text-lg font-semibold">
              🚀 Growth Tip
            </h3>

            <p className="text-gray-400 mt-1">
              Improve delivery speed and reduce cancellations to maximize revenue.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/orders")}
            className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition text-white font-semibold"
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnlineDashboard;