import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [updatingId, setUpdatingId] =
    useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // FETCH ORDERS
  // ===============================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STATUS FLOW
  // ===============================
  const getNextStatuses = (status) => {
    switch (status) {
      case "PLACED":
        return [
          "CONFIRMED",
          "CANCELLED",
        ];

      case "CONFIRMED":
        return [
          "SHIPPED",
          "CANCELLED",
        ];

      case "SHIPPED":
        return ["DELIVERED"];

      default:
        return [];
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);

      await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status`,
        null,
        {
          params: { status },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status,
              }
            : o
        )
      );

      setSelectedOrder((prev) =>
        prev &&
        prev.id === orderId
          ? {
              ...prev,
              status,
            }
          : prev
      );
    } catch (err) {
      console.error(
        "Status update failed",
        err
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ===============================
  // FORMAT DATE
  // ===============================
  const formatDate = (date) =>
    new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  // ===============================
  // STATUS COLORS
  // ===============================
  const getStatusClass = (
    status
  ) => {
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

  // ===============================
  // SEARCH
  // ===============================
  const filteredOrders =
    orders.filter((order) =>
      `${order.id} ${
        order.userName || ""
      } ${order.email || ""}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-green-400">
            📬 Admin Orders
          </h1>

          <p className="text-gray-400 mt-1">
            Manage all customer
            orders
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by ID / User..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none w-72"
        />

      </div>

      {/* TABLE */}
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">

        <div className="grid grid-cols-12 px-5 py-4 border-b border-white/10 text-sm text-gray-400 font-semibold">
          <div className="col-span-1">
            ID
          </div>
          <div className="col-span-3">
            Customer
          </div>
          <div className="col-span-2">
            Amount
          </div>
          <div className="col-span-2">
            Status
          </div>
          <div className="col-span-2">
            Date
          </div>
          <div className="col-span-2">
            Action
          </div>
        </div>

        {filteredOrders.length ===
        0 ? (
          <p className="p-5 text-gray-400">
            No orders found
          </p>
        ) : (
          filteredOrders.map(
            (order, i) => (
              <div
                key={order.id}
                className={`grid grid-cols-12 px-5 py-4 items-center border-b border-white/5 hover:bg-white/5 transition ${
                  i % 2 === 0
                    ? "bg-white/[0.02]"
                    : ""
                }`}
              >
                <div className="col-span-1 font-bold">
                  #
                  {order.id}
                </div>

                <div className="col-span-3">
                  <p className="font-semibold">
                    {order.userName ||
                      "Customer"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {order.email}
                  </p>
                </div>

                <div className="col-span-2 font-semibold text-green-400">
                  ₹
                  {
                    order.totalAmount
                  }
                </div>

                <div className="col-span-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {
                      order.status
                    }
                  </span>
                </div>

                <div className="col-span-2 text-sm text-gray-400">
                  {formatDate(
                    order.createdAt
                  )}
                </div>

                <div className="col-span-2">
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        order
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-semibold"
                  >
                    View
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* ===========================
          VIEW MODAL
      =========================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">

          <div className="w-full max-w-3xl rounded-2xl bg-gray-900 border border-white/10 p-6 max-h-[90vh] overflow-y-auto">

            {/* TOP */}
            <div className="flex justify-between items-start gap-4">

              <div>
                <h2 className="text-2xl font-bold text-green-400">
                  Order #
                  {
                    selectedOrder.id
                  }
                </h2>

                <p className="text-gray-400 mt-1">
                  {formatDate(
                    selectedOrder.createdAt
                  )}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                className="text-xl text-gray-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* STATUS */}
            <div className="mt-5">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                  selectedOrder.status
                )}`}
              >
                {
                  selectedOrder.status
                }
              </span>
            </div>

            {/* CUSTOMER */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div>
                <h3 className="font-semibold mb-2">
                  Customer
                </h3>

                <p>
                  {
                    selectedOrder.userName
                  }
                </p>

                <p className="text-gray-400">
                  {
                    selectedOrder.email
                  }
                </p>

                <p className="text-gray-400">
                  {
                    selectedOrder.phone
                  }
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Address
                </h3>

                <p>
                  {
                    selectedOrder.addressLine
                  }
                </p>

                <p>
                  {
                    selectedOrder.city
                  }{" "}
                  {
                    selectedOrder.state
                  }
                </p>

                <p>
                  {
                    selectedOrder.pincode
                  }
                </p>
              </div>

            </div>

            {/* ITEMS */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Ordered Items
              </h3>

              <div className="space-y-3">
                {selectedOrder.items?.map(
                  (
                    item,
                    i
                  ) => (
                    <div
                      key={i}
                      className="flex justify-between p-3 rounded-xl bg-white/5"
                    >
                      <span>
                        {
                          item.productName
                        }{" "}
                        ×{" "}
                        {
                          item.quantity
                        }
                      </span>

                      <span>
                        ₹
                        {(
                          Number(
                            item.price ||
                              item.priceAtTime
                          ) *
                          Number(
                            item.quantity
                          )
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* TOTAL */}
            <div className="flex justify-between pt-5 mt-5 border-t border-white/10">

              <p className="font-semibold">
                Total Amount
              </p>

              <p className="text-xl font-bold text-green-400">
                ₹
                {
                  selectedOrder.totalAmount
                }
              </p>

            </div>

            {/* STATUS ACTIONS */}
            <div className="flex flex-wrap gap-3 mt-6">

              {getNextStatuses(
                selectedOrder.status
              ).map(
                (
                  status
                ) => (
                  <button
                    key={
                      status
                    }
                    onClick={() =>
                      updateStatus(
                        selectedOrder.id,
                        status
                      )
                    }
                    disabled={
                      updatingId ===
                      selectedOrder.id
                    }
                    className="px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 font-semibold disabled:opacity-50"
                  >
                    {updatingId ===
                    selectedOrder.id
                      ? "Updating..."
                      : status}
                  </button>
                )
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminOrders;