import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] =
    useSearchParams();

  const [seconds, setSeconds] =
    useState(8);

  // ========================
  // QUERY DATA
  // ========================
  const orderId =
    searchParams.get(
      "orderId"
    );

  const mode =
    (
      searchParams.get(
        "mode"
      ) || "COD"
    ).toUpperCase();

  const amount =
    searchParams.get(
      "amount"
    ) || "0";

  const txnId =
    searchParams.get(
      "txnId"
    ) || "";

  const isUPI =
    mode === "UPI";

  // ========================
  // REDIRECT IF NO ORDER ID
  // ========================
  useEffect(() => {
    if (!orderId) {
      navigate(
        "/orders"
      );
    }
  }, [
    orderId,
    navigate,
  ]);

  // ========================
  // AUTO REDIRECT TIMER
  // ========================
  useEffect(() => {
    const timer =
      setInterval(() => {
        setSeconds(
          (prev) =>
            prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(
        timer
      );
  }, []);

  useEffect(() => {
    if (
      seconds <= 0
    ) {
      navigate(
        "/orders"
      );
    }
  }, [
    seconds,
    navigate,
  ]);

  // ========================
  // UI DATA
  // ========================
  const title =
    "Order Placed Successfully";

  const subtitle =
    isUPI
      ? "Your payment details were submitted successfully. Admin will verify your payment soon."
      : "Your order has been placed successfully. Payment will be collected after delivery.";

  const paymentStatus =
    "PENDING";

  const paymentColor =
    "text-orange-500";

  // ========================
  // LOADING SAFETY
  // ========================
  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">

        <div className="max-w-4xl mx-auto">

          {/* CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl p-8 sm:p-10">

            {/* SUCCESS ICON */}
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-6xl animate-bounce">
                ✅
              </div>
            </div>

            {/* TITLE */}
            <div className="text-center mt-6">
              <h1 className="text-4xl font-bold text-green-600">
                {title}
              </h1>

              <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
                {subtitle}
              </p>
            </div>

            {/* SUMMARY */}
            <div className="grid md:grid-cols-4 gap-4 mt-8">

              <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-5 text-center">
                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <h3 className="text-xl font-bold mt-2">
                  #{orderId}
                </h3>
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-5 text-center">
                <p className="text-sm text-gray-500">
                  Payment Mode
                </p>

                <h3 className="text-lg font-bold mt-2">
                  {mode}
                </h3>
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-5 text-center">
                <p className="text-sm text-gray-500">
                  Amount
                </p>

                <h3 className="text-xl font-bold mt-2">
                  ₹{amount}
                </h3>
              </div>

              <div className="rounded-2xl bg-gray-50 dark:bg-slate-800 p-5 text-center">
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <h3
                  className={`text-lg font-bold mt-2 ${paymentColor}`}
                >
                  {paymentStatus}
                </h3>
              </div>

            </div>

            {/* EXTRA SECTION */}
            <div className="mt-8 grid md:grid-cols-2 gap-5">

              {/* PAYMENT INFO */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5">

                <h2 className="font-bold text-lg mb-4">
                  💳 Payment Details
                </h2>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Method
                    </span>

                    <span className="font-semibold">
                      {mode}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Status
                    </span>

                    <span
                      className={`font-semibold ${paymentColor}`}
                    >
                      Pending Verification
                    </span>
                  </div>

                  {isUPI && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        Transaction ID
                      </span>

                      <span className="font-semibold break-all text-right">
                        {txnId ||
                          "Submitted"}
                      </span>
                    </div>
                  )}

                  {!isUPI && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        Collection
                      </span>

                      <span className="font-semibold">
                        After Delivery
                      </span>
                    </div>
                  )}

                </div>

              </div>

              {/* DELIVERY INFO */}
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5">

                <h2 className="font-bold text-lg mb-4">
                  🚚 Delivery Info
                </h2>

                <p className="text-gray-600 dark:text-gray-400 leading-7">
                  Your order is expected within
                  <span className="font-semibold text-blue-600">
                    {" "}
                    2 - 4 business days
                  </span>
                  . You can track everything from the Orders page.
                </p>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">

              <Link
                to="/orders"
                className="text-center py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                View Orders
              </Link>

              <Link
                to={`/orders/${orderId}`}
                className="text-center py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Order Details
              </Link>

              <Link
                to="/home"
                className="text-center py-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold"
              >
                Continue Shopping
              </Link>

            </div>

            {/* TIMER */}
            <p className="text-center mt-8 text-sm text-gray-500">
              Redirecting to Orders in{" "}
              <span className="font-bold text-green-600">
                {seconds}
              </span>{" "}
              sec...
            </p>

          </div>

          <p className="text-center mt-6 text-sm text-gray-500">
            Need help? Contact Agro App Support anytime.
          </p>

        </div>

      </div>
    </div>
  );
}

export default PaymentSuccess;