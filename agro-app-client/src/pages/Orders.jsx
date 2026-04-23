import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 🔥 ADD

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // 🔥 ADD
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/orders/my",
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

  // 🔥 FORMAT DATE
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // 🔥 STATUS COLOR
  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-yellow-500/20 text-yellow-400";

      case "CONFIRMED":
        return "bg-blue-500/20 text-blue-400";

      case "SHIPPED":
        return "bg-purple-500/20 text-purple-400";

      case "DELIVERED":
        return "bg-green-500/20 text-green-400";

      case "CANCELLED":
        return "bg-red-500/20 text-red-400";

      default:
        return "";
    }
  };

  // 🔥 ORDER STATE TEXT
  const getOrderState = (status) => {
    if (status === "DELIVERED") return "Completed";
    if (status === "CANCELLED") return "Cancelled";
    return "In Progress";
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No orders yet
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-6 
    bg-gray-100 dark:bg-gray-900 
    text-gray-800 dark:text-white"
    >
      <h1 className="text-2xl font-bold mb-6">
        📦 My Orders
      </h1>

      <div className="space-y-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 
            p-5 rounded-xl shadow space-y-3"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  Order #{order.id}
                </p>

                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* BODY */}
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-sm text-gray-500">
                  Order Status
                </p>
                <p className="font-semibold">
                  {getOrderState(order.status)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Total
                </p>
                <p className="text-green-500 font-bold text-lg">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>

            {/* ACTION */}
            <div className="pt-2">
              <button
                onClick={() => navigate(`/orders/${order.id}`)} // 🔥 FIX
                className="text-green-500 hover:underline text-sm"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;