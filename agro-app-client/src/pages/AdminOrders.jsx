import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

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

  // ==========================
  // STATUS FLOW
  // ==========================
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

  // ==========================
  // STATUS UPDATE
  // ==========================
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

  // ==========================
  // STATUS COLORS
  // ==========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "SHIPPED":
        return "bg-purple-100 text-purple-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================
  // FORMAT DATE
  // ==========================
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================
  // SEARCH FILTER
  // ==========================
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.userName || ""} ${order.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-6
      bg-gray-100 dark:bg-gray-900
      text-gray-800 dark:text-white"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          🛠️ Admin Orders
        </h1>

        <input
          type="text"
          placeholder="Search by Order ID / User"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border
          bg-white dark:bg-gray-800
          dark:border-gray-700 outline-none"
        />
      </div>

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">
            {orders.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Placed</p>
          <p className="text-2xl font-bold text-yellow-500">
            {orders.filter((o) => o.status === "PLACED").length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-bold text-green-500">
            {orders.filter((o) => o.status === "DELIVERED").length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-red-500">
            {orders.filter((o) => o.status === "CANCELLED").length}
          </p>
        </div>
      </div>

      {/* EMPTY */}
      {filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No orders found
        </div>
      )}

      {/* LIST */}
      <div className="space-y-5">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800
            p-5 rounded-2xl shadow space-y-4"
          >
            {/* TOP */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-lg font-bold">
                  Order #{order.id}
                </p>

                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold w-fit ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* USER DETAILS */}
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">
                  Customer
                </p>

                <p className="font-semibold">
                  {order.userName || "N/A"}
                </p>

                <p>{order.email || "No email"}</p>

                <p>{order.phone || "No phone"}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">
                  Delivery Address
                </p>

                <p>
                  {order.addressLine || "No address"}
                </p>

                <p>
                  {order.city || ""} {order.state || ""}
                </p>

                <p>{order.pincode || ""}</p>
              </div>
            </div>

            {/* ITEMS */}
            {order.items && order.items.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm mb-2">
                  Ordered Items
                </p>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm
                      bg-gray-100 dark:bg-gray-700
                      px-3 py-2 rounded-lg"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>

                      <span>
                        ₹
                        {(item.price || item.priceAtTime) *
                          item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TOTAL */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="font-semibold">
                Total Amount
              </p>

              <p className="text-lg font-bold text-green-500">
                ₹{order.totalAmount}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 pt-2">
              {getNextStatuses(order.status).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(order.id, s)}
                  disabled={updatingId === order.id}
                  className="px-4 py-2 text-sm rounded-xl
                  bg-gray-200 dark:bg-gray-700
                  hover:bg-green-500 hover:text-white
                  transition disabled:opacity-50"
                >
                  {updatingId === order.id
                    ? "Updating..."
                    : s}
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