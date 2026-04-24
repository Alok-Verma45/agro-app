import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {/* ICON */}
        <div className="text-6xl mb-4 animate-bounce">
          ✅
        </div>

        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Order Placed Successfully!
        </h1>

        {/* MESSAGE */}
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          Thank you for shopping with us.  
          Your payment/order has been confirmed successfully.
        </p>

        {/* INFO BOX */}
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 mb-6">
          <p className="text-green-600 dark:text-green-400 font-semibold">
            Your order is now being processed 🚚
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
          >
            View My Orders 📦
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
          >
            Continue Shopping 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;