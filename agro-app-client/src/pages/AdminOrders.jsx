import { useEffect, useState } from "react";
import API from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // FETCH ORDERS
  // ===============================
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/all");

      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ORDER FLOW
  // ===============================
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

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await API.put(`/orders/${orderId}/status`, null, {
        params: { status },
      });

      await refreshData(orderId);
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // ===============================
  // VERIFY PAYMENT
  // ===============================
  const verifyPayment = async (orderId) => {
    try {
      setUpdatingId(orderId);

      await API.put(`/orders/${orderId}/payment/verify`);

      await refreshData(orderId);
    } catch (err) {
      console.error(err);
      alert("Payment verify failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // ===============================
  // REJECT PAYMENT
  // ===============================
  const rejectPayment = async (orderId) => {
    try {
      setUpdatingId(orderId);

      await API.put(`/orders/${orderId}/payment/reject`);

      await refreshData(orderId);
    } catch (err) {
      console.error(err);
      alert("Payment reject failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // ===============================
  // REFRESH
  // ===============================
  const refreshData = async (orderId) => {
    await fetchOrders();

    const updated = await API.get(`/orders/${orderId}`);

    setSelectedOrder(updated.data);
  };

  // ===============================
  // HELPERS
  // ===============================
  const formatDate = (date) =>
    date ? new Date(date).toLocaleString("en-IN") : "N/A";

  const getStatusClass = (status) => {
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
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPaymentClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/20 text-green-400";

      case "FAILED":
        return "bg-red-500/20 text-red-400";

      case "REFUNDED":
        return "bg-blue-500/20 text-blue-400";

      default:
        return "bg-orange-500/20 text-orange-400";
    }
  };

  // ===============================
  // SEARCH
  // ===============================
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.userName || ""} ${order.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="py-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-400">📬 Admin Orders</h1>

          <p className="text-gray-400 mt-1">Orders + Payment Management</p>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none w-full md:w-72"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-2xl overflow-x-auto border border-white/10 bg-white/5">
        <div className="min-w-[950px]">
          <div className="grid grid-cols-12 px-5 py-4 border-b border-white/10 text-sm text-gray-400 font-semibold">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Order</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-2">Action</div>
          </div>

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-12 px-5 py-4 border-b border-white/5 items-center hover:bg-white/5"
            >
              <div className="col-span-1 font-bold">#{order.id}</div>

              <div className="col-span-3">
                <p className="font-semibold">{order.userName}</p>

                <p className="text-xs text-gray-400">{order.email}</p>
              </div>

              <div className="col-span-2 text-green-400 font-semibold">
                ₹{order.totalAmount}
              </div>

              <div className="col-span-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusClass(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="col-span-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getPaymentClass(
                    order.paymentStatus,
                  )}`}
                >
                  {order.paymentStatus || "PENDING"}
                </span>
              </div>

              <div className="col-span-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-gray-900 border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            {/* TOP */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-green-400">
                  Order #{selectedOrder.id}
                </h2>

                <p className="text-gray-400 mt-1">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xl text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* PAYMENT */}
            <div className="mt-6 bg-white/5 rounded-2xl p-5">
              <h3 className="font-semibold mb-4">💳 Payment Info</h3>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p>
                  Method:
                  <span className="ml-2 font-semibold">
                    {selectedOrder.paymentMethod}
                  </span>
                </p>

                <p>
                  Status:
                  <span
                    className={`ml-2 px-2 py-1 rounded-lg text-xs ${getPaymentClass(
                      selectedOrder.paymentStatus,
                    )}`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </p>

                <p>
                  Txn ID:
                  <span className="ml-2 font-semibold">
                    {selectedOrder.transactionId || "N/A"}
                  </span>
                </p>

                <p>
                  Paid At:
                  <span className="ml-2 font-semibold">
                    {formatDate(selectedOrder.paidAt)}
                  </span>
                </p>
              </div>
            </div>

            {/* ORDER ACTIONS */}
            <div className="flex flex-wrap gap-3 mt-6">
              {getNextStatuses(selectedOrder.status).map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(selectedOrder.id, status)}
                  disabled={updatingId === selectedOrder.id}
                  className="px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-50"
                >
                  {status}
                </button>
              ))}
            </div>

            {/* PAYMENT ACTIONS */}
            {selectedOrder.status !== "CANCELLED" &&
              selectedOrder.paymentStatus !== "PAID" &&
              selectedOrder.paymentStatus !== "REFUNDED" && (
                <div className="mt-5">
                  <h3 className="font-semibold mb-3">Payment Actions</h3>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => verifyPayment(selectedOrder.id)}
                      disabled={updatingId === selectedOrder.id}
                      className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                    >
                      ✅ Verify Payment
                    </button>

                    <button
                      onClick={() => rejectPayment(selectedOrder.id)}
                      disabled={updatingId === selectedOrder.id}
                      className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50"
                    >
                      ❌ Reject Payment
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
