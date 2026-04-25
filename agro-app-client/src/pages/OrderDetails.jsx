import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  // =========================
  // LOAD ORDER
  // =========================
  const loadOrder = async () => {
    try {
      const res =
        await API.get(
          `/orders/${id}`
        );

      setOrder(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HELPERS
  // =========================
  const prettyText = (value) =>
    value
      ?.toLowerCase()
      .replace(/_/g, " ")
      .replace(
        /\b\w/g,
        (c) => c.toUpperCase()
      );

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

  const getPaymentStyle = (
    status
  ) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-500";

      case "FAILED":
        return "bg-red-500/10 text-red-500";

      case "REFUNDED":
        return "bg-blue-500/10 text-blue-500";

      default:
        return "bg-orange-500/10 text-orange-500";
    }
  };

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

  // =========================
  // PAYMENT STATUS LOGIC
  // =========================
  const getVisiblePaymentStatus =
    () => {
      if (
        !order?.paymentStatus
      ) {
        return "PENDING";
      }

      // UPI => admin verify ke baad PAID
      if (
        order.paymentMethod ===
        "UPI"
      ) {
        return order.paymentStatus;
      }

      // COD => delivered hone ke baad paid
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
  // CANCEL ORDER
  // =========================
  const handleCancelOrder =
    async () => {
      const confirmBox =
        window.confirm(
          "Are you sure you want to cancel this order?"
        );

      if (!confirmBox)
        return;

      try {
        setProcessing(true);

        await API.put(
          `/orders/${order.id}/cancel`
        );

        alert(
          "Order cancelled successfully"
        );

        await loadOrder();
      } catch (error) {
        console.error(error);

        alert(
          error?.response?.data ||
            "Failed to cancel order"
        );
      } finally {
        setProcessing(false);
      }
    };

  // =========================
  // HELP
  // =========================
  const handleHelp = () => {
    const msg = `Hello Agro App Support, I need help regarding Order #${order.id}`;

    window.open(
      `https://wa.me/919628586190?text=${encodeURIComponent(
        msg
      )}`,
      "_blank"
    );
  };

  const handleBuyAgain =
    () => navigate("/home");

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const items =
    order.items || [];

  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          item.quantity,
      0
    );

  const paymentStatus =
    getVisiblePaymentStatus();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white">
      <div className="w-full px-3 sm:px-5 lg:px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              📄 Order Details
            </h1>

            <p className="text-gray-500 mt-1">
              Order #{order.id}
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10"
          >
            ← Back to Orders
          </button>

        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* SUMMARY */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold">
                    Order #{order.id}
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
                    {prettyText(
                      order.status
                    )}
                  </span>

                  <span className="text-2xl font-bold text-green-500">
                    ₹
                    {order.totalAmount}
                  </span>

                </div>

              </div>

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

            </div>

            {/* ITEMS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6">

              <h2 className="text-2xl font-bold mb-6">
                🛒 Ordered Items
              </h2>

              <div className="space-y-5">
                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-4"
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                          🌾
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {
                              item.productName
                            }
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₹
                          {Number(
                            item.price
                          ) *
                            item.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          ₹
                          {
                            item.price
                          } each
                        </p>
                      </div>

                    </div>
                  )
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10 flex justify-between text-xl font-bold">
                <span>
                  Subtotal
                </span>

                <span className="text-green-500">
                  ₹
                  {subtotal}
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-8">

            {/* ADDRESS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6">

              <h2 className="text-2xl font-bold mb-5">
                🚚 Delivery Address
              </h2>

              <div className="space-y-3 text-gray-700 dark:text-gray-300">

                <p><b>Name:</b> {order.fullName}</p>
                <p><b>Phone:</b> {order.phone}</p>
                <p><b>Address:</b> {order.addressLine}</p>
                <p><b>City:</b> {order.city}</p>
                <p><b>State:</b> {order.state}</p>
                <p><b>PIN:</b> {order.pincode}</p>

              </div>

            </div>

            {/* PAYMENT */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6">

              <h2 className="text-2xl font-bold mb-5">
                💳 Payment Information
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Method
                  </span>

                  <span className="font-semibold">
                    {order.paymentMethod ===
                    "UPI"
                      ? "UPI Payment"
                      : "Cash on Delivery"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStyle(
                      paymentStatus
                    )}`}
                  >
                    {prettyText(
                      paymentStatus
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Transaction ID
                  </span>

                  <span className="font-semibold text-right break-all">
                    {order.transactionId ||
                      "Not Required"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Paid At
                  </span>

                  <span className="font-semibold text-right">
                    {paymentStatus ===
                    "PAID"
                      ? new Date(
                          order.paidAt
                        ).toLocaleString()
                      : "Pending Verification"}
                  </span>
                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 p-6">

              <h2 className="text-2xl font-bold mb-5">
                ⚡ Actions
              </h2>

              <div className="space-y-4">

                {(order.status ===
                  "PLACED" ||
                  order.status ===
                    "CONFIRMED") && (
                  <button
                    disabled={
                      processing
                    }
                    onClick={
                      handleCancelOrder
                    }
                    className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold"
                  >
                    {processing
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}

                {order.status !==
                  "CANCELLED" && (
                  <button
                    onClick={
                      handleBuyAgain
                    }
                    className="w-full py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Buy Again
                  </button>
                )}

                <button
                  onClick={
                    handleHelp
                  }
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Need Help
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderDetails;