import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrder(res.data);
    } catch (err) {
      console.error("❌ Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STATUS STYLE
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
      bg-gray-100 dark:bg-gray-900 text-gray-500">
        ⏳ Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const subtotal = order.totalAmount;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6
    bg-gray-100 dark:bg-gray-900 
    text-gray-800 dark:text-white">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-5 
        text-sm text-gray-500 dark:text-gray-400 
        hover:text-green-500 transition"
      >
        <span className="text-lg">←</span>
        Back
      </button>

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-6 
      flex justify-between items-start flex-wrap gap-3">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Order #{order.id}
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        {/* STATUS */}
        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* ITEMS */}
      <div className="max-w-4xl mx-auto space-y-4">

        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center 
            bg-white dark:bg-gray-800 
            p-4 rounded-xl shadow border 
            border-gray-200 dark:border-gray-700"
          >
            {/* LEFT */}
            <div>
              <p className="font-semibold text-lg">
                {item.productName}
              </p>

              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>

            {/* RIGHT */}
            <p className="font-bold text-green-500 text-lg">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}

      </div>

      {/* SUMMARY */}
      <div className="max-w-4xl mx-auto mt-6 
      bg-white dark:bg-gray-800 
      p-5 rounded-xl shadow border 
      border-gray-200 dark:border-gray-700 space-y-3">

        <h2 className="text-lg font-semibold mb-2">
          Order Summary
        </h2>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-green-500">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;