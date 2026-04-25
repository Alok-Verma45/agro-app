import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [processingId, setProcessingId] =
    useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================
  // LOAD ORDERS
  // =========================
  const loadOrders = async () => {
    try {
      setLoading(true);

      const res =
        await API.get(
          "/orders/my"
        );

      setOrders(
        res.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CANCEL ORDER
  // =========================
  const handleCancelOrder =
    async (orderId) => {
      const confirmBox =
        window.confirm(
          "Are you sure you want to cancel this order?"
        );

      if (!confirmBox)
        return;

      try {
        setProcessingId(
          orderId
        );

        await API.put(
          `/orders/${orderId}/cancel`
        );

        alert(
          "Order cancelled successfully"
        );

        await loadOrders();
      } catch (
        error
      ) {
        console.error(
          error
        );

        alert(
          error?.response
            ?.data ||
            "Failed to cancel order"
        );
      } finally {
        setProcessingId(
          null
        );
      }
    };

  // =========================
  // ORDER STATUS STYLE
  // =========================
  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-500/10 text-blue-500";

      case "CONFIRMED":
        return "bg-purple-500/10 text-purple-500";

      case "SHIPPED":
        return "bg-orange-500/10 text-orange-500";

      case "DELIVERED":
        return "bg-green-500/10 text-green-500";

      case "CANCELLED":
        return "bg-red-500/10 text-red-500";

      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  // =========================
  // PAYMENT STYLE
  // =========================
  const getPaymentStyle = (
    paymentStatus
  ) => {
    switch (
      paymentStatus
    ) {
      case "PAID":
        return "text-green-500";

      case "FAILED":
        return "text-red-500";

      case "REFUNDED":
        return "text-blue-500";

      default:
        return "text-orange-500";
    }
  };

  // =========================
  // ORDER PROGRESS
  // =========================
  const getProgress = (
    status
  ) => {
    switch (status) {
      case "PLACED":
        return 25;

      case "CONFIRMED":
        return 50;

      case "SHIPPED":
        return 75;

      case "DELIVERED":
        return 100;

      default:
        return 0;
    }
  };

  const prettyStatus = (
    value
  ) =>
    value
      ?.toLowerCase()
      .replaceAll(
        "_",
        " "
      )
      .replace(
        /\b\w/g,
        (c) =>
          c.toUpperCase()
      );

  // =========================
  // PAYMENT STATUS LOGIC
  // UPI = admin verify ke baad PAID
  // COD = delivered ke baad PAID
  // =========================
  const getVisiblePaymentStatus =
    (order) => {
      if (
        !order.paymentStatus
      ) {
        return "PENDING";
      }

      if (
        order.paymentMethod ===
        "UPI"
      ) {
        return order.paymentStatus;
      }

      if (
        order.paymentMethod ===
        "COD"
      ) {
        if (
          order.status ===
          "DELIVERED"
        ) {
          return "PAID";
        }

        return "PENDING";
      }

      return order.paymentStatus;
    };

  // =========================
  // FILTER
  // =========================
  const filteredOrders =
    orders.filter(
      (order) =>
        String(
          order.id
        ).includes(
          search
        ) ||
        order.status
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        order.paymentMethod
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================
  if (
    orders.length === 0
  ) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-white/10 text-center">

          <div className="text-7xl mb-4">
            📦
          </div>

          <h1 className="text-3xl font-bold">
            No Orders Yet
          </h1>

          <p className="mt-3 text-gray-500">
            Start shopping and place your first order.
          </p>

          <button
            onClick={() =>
              navigate(
                "/home"
              )
            }
            className="mt-6 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Shop Now
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white">

      <div className="w-full px-3 sm:px-5 lg:px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              📦 My Orders
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and track your orders
            </p>
          </div>

          <input
            type="text"
            placeholder="Search order..."
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
              )
            }
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 outline-none w-full lg:w-96"
          />

        </div>

        {/* LIST */}
        <div className="space-y-6">

          {filteredOrders.map(
            (
              order
            ) => {
              const visiblePaymentStatus =
                getVisiblePaymentStatus(
                  order
                );

              return (
                <div
                  key={
                    order.id
                  }
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6"
                >

                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                      <h2 className="text-xl font-bold">
                        Order #
                        {
                          order.id
                        }
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {prettyStatus(
                          order.status
                        )}
                      </span>

                      <span className="text-2xl font-bold text-green-500">
                        ₹
                        {
                          order.totalAmount
                        }
                      </span>

                    </div>

                  </div>

                  {/* PAYMENT */}
                  <div className="mt-5 grid md:grid-cols-2 gap-4">

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">
                      <p className="text-sm text-gray-500">
                        Payment Method
                      </p>

                      <p className="font-semibold mt-1">
                        {prettyStatus(
                          order.paymentMethod ||
                            "COD"
                        )}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">
                      <p className="text-sm text-gray-500">
                        Payment Status
                      </p>

                      <p
                        className={`font-semibold mt-1 ${getPaymentStyle(
                          visiblePaymentStatus
                        )}`}
                      >
                        {prettyStatus(
                          visiblePaymentStatus
                        )}
                      </p>
                    </div>

                  </div>

                  {/* PROGRESS */}
                  {order.status !==
                    "CANCELLED" && (
                    <div className="mt-6">

                      <div className="h-3 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${getProgress(
                              order.status
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>
                          Placed
                        </span>
                        <span>
                          Confirmed
                        </span>
                        <span>
                          Shipped
                        </span>
                        <span>
                          Delivered
                        </span>
                      </div>

                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        navigate(
                          `/orders/${order.id}`
                        )
                      }
                      className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </button>

                    {(order.status ===
                      "PLACED" ||
                      order.status ===
                        "CONFIRMED") && (
                      <button
                        disabled={
                          processingId ===
                          order.id
                        }
                        onClick={() =>
                          handleCancelOrder(
                            order.id
                          )
                        }
                        className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white"
                      >
                        {processingId ===
                        order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}

                    {order.status ===
                      "DELIVERED" && (
                      <button
                        onClick={() =>
                          navigate(
                            "/home"
                          )
                        }
                        className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white"
                      >
                        Buy Again
                      </button>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>
    </div>
  );
}

export default Orders;