import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/orders/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 FLOW BASED STATUS OPTIONS
  const getNextStatuses = (status) => {
    switch (status) {
      case "PLACED":
        return ["CONFIRMED", "CANCELLED"];

      case "CONFIRMED":
        return ["SHIPPED", "CANCELLED"];

      case "SHIPPED":
        return ["DELIVERED"];

      default:
        return [];
    }
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status`,
        null,
        {
          params: { status },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 🔥 LOCAL UPDATE
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-6 
    bg-gray-100 dark:bg-gray-900 
    text-gray-800 dark:text-white">

      <h1 className="text-2xl font-bold mb-6">
        🛠️ Admin Orders
      </h1>

      <div className="space-y-4">

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 
            p-5 rounded-xl shadow space-y-3"
          >

            {/* TOP */}
            <div className="flex justify-between items-center">
              <p className="font-semibold">
                Order #{order.id}
              </p>

              {/* STATUS BADGE */}
              <span className={`px-3 py-1 text-xs rounded-full font-semibold
                ${order.status === "PLACED" && "bg-yellow-100 text-yellow-600"}
                ${order.status === "CONFIRMED" && "bg-blue-100 text-blue-600"}
                ${order.status === "SHIPPED" && "bg-purple-100 text-purple-600"}
                ${order.status === "DELIVERED" && "bg-green-100 text-green-600"}
                ${order.status === "CANCELLED" && "bg-red-100 text-red-600"}
              `}>
                {order.status}
              </span>
            </div>

            <p>Total: ₹{order.totalAmount}</p>

            <p className="text-sm text-gray-500">
              {order.createdAt}
            </p>

            {/* 🔥 STATUS CONTROL (FIXED) */}
            <div className="flex flex-wrap gap-2 pt-2">

              {getNextStatuses(order.status).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  disabled={updatingId === order.id}
                  className="px-3 py-1 text-xs rounded-lg 
                  bg-gray-200 dark:bg-gray-700 
                  hover:bg-green-500 hover:text-white transition
                  disabled:opacity-50"
                >
                  {s}
                </button>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminOrders;