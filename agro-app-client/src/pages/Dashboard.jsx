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

  // ⭐ SORT pending list
  const sortedPending = [...pendingList].sort(
    (a, b) => b.pendingAmount - a.pendingAmount
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 flex items-center gap-1">
            Total Customers 👥
          </p>
          <h2 className="text-2xl font-bold">{customers.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 flex items-center gap-1">
            Total Sales 💰
          </p>
          <h2 className="text-2xl font-bold text-blue-600">
            ₹{dashboard.totalCredit || 0}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 flex items-center gap-1">
            Amount Received 💵
          </p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{dashboard.totalPaid || 0}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 flex items-center gap-1">
            Pending Amount ⚠️
          </p>
          <h2 className="text-2xl font-bold text-red-500">
            ₹{dashboard.totalPending || 0}
          </h2>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white p-6 rounded-xl shadow border mb-6">
        <h2 className="text-xl font-semibold mb-4">Top Customers</h2>

        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Customer</th>
              <th className="p-2">Pending</th>
            </tr>
          </thead>

          <tbody>
            {topCustomers.map((c, i) => (
              <tr
                key={i}
                className={`bg-white shadow-sm rounded-lg ${
                  i === 0 ? "bg-red-50 font-semibold" : ""
                }`}
              >
                <td className="p-3">{c.customerName}</td>
                <td className="p-3 font-semibold text-red-500">
                  ₹{c.pendingAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Pending */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">
          Customer Pending Overview
        </h2>

        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Customer</th>
              <th className="p-2">Pending</th>
            </tr>
          </thead>

          <tbody>
            {sortedPending.map((c, i) => (
              <tr
                key={i}
                className={`bg-white shadow-sm rounded-lg ${
                  i === 0 ? "bg-red-50 font-semibold" : ""
                }`}
              >
                <td className="p-3">{c.customerName}</td>
                <td className="p-3 text-red-500 font-medium">
                  ₹{c.pendingAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;