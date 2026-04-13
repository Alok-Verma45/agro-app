import { useEffect, useState } from "react";
import { getCustomers } from "../api/customerApi";

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    topCustomer: "N/A",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCustomers();
      const customers = res.data;

      console.log("API DATA:", customers); // debug

      setStats({
        customers: customers.length,
        topCustomer: customers[0]?.name || "N/A",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Customers</h3>
          <p className="text-xl font-bold">{stats.customers}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Top Customer</h3>
          <p className="text-xl font-bold">{stats.topCustomer}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;