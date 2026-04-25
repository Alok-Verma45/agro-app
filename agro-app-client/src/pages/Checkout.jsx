import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";
import API from "../api/axios";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [placing, setPlacing] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [form, setForm] =
    useState({
      fullName: "",
      phone: "",
      pincode: "",
      city: "",
      state: "",
      addressLine: "",
      transactionId: "",
    });

  const upiId =
    "alokkumar09921-1@oksbi";

  const upiPhone =
    "9628586190";

  // =========================
  // LOAD CART
  // =========================
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart =
    async () => {
      try {
        const res =
          await getCart();

        setCart(res.data);
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================
  // INPUT
  // =========================
  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // TOTALS
  // =========================
  const items =
    cart?.items || [];

  const subtotal =
    Number(
      cart?.totalAmount ||
        0
    );

  const delivery =
    subtotal === 0 ||
    subtotal >= 999
      ? 0
      : 60;

  const total =
    subtotal +
    delivery;

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    if (
      !form.fullName.trim()
    )
      return "Enter full name";

    if (
      !form.phone.trim()
    )
      return "Enter phone";

    if (
      form.phone.length <
      10
    )
      return "Enter valid phone";

    if (
      !form.pincode.trim()
    )
      return "Enter pincode";

    if (
      !form.city.trim()
    )
      return "Enter city";

    if (
      !form.state.trim()
    )
      return "Enter state";

    if (
      !form.addressLine.trim()
    )
      return "Enter address";

    if (
      paymentMethod ===
        "UPI" &&
      !form.transactionId.trim()
    )
      return "Enter UPI Transaction ID";

    if (
      items.length === 0
    )
      return "Cart is empty";

    return null;
  };

  // =========================
  // COPY TEXT
  // =========================
  const copyText =
    async (
      value,
      label
    ) => {
      try {
        await navigator.clipboard.writeText(
          value
        );

        alert(
          `${label} copied`
        );
      } catch {
        alert(
          "Copy failed"
        );
      }
    };

  // =========================
  // PLACE ORDER
  // =========================
  const placeOrder =
    async () => {
      const errorMsg =
        validate();

      if (errorMsg) {
        alert(errorMsg);
        return;
      }

      try {
        setPlacing(true);

        const res =
          await API.post(
            "/orders/place",
            {
              fullName:
                form.fullName,
              phone:
                form.phone,
              pincode:
                form.pincode,
              city:
                form.city,
              state:
                form.state,
              addressLine:
                form.addressLine,
              paymentMethod,
              transactionId:
                paymentMethod ===
                "UPI"
                  ? form.transactionId
                  : null,
            }
          );

        let orderId =
          res?.data?.id;

        if (
          !orderId &&
          typeof res.data ===
            "number"
        ) {
          orderId =
            res.data;
        }

        if (!orderId) {
          const orderRes =
            await API.get(
              "/orders/my"
            );

          if (
            orderRes.data &&
            orderRes.data
              .length > 0
          ) {
            orderId =
              orderRes
                .data[0].id;
          }
        }

        window.dispatchEvent(
          new Event(
            "cartUpdated"
          )
        );

        navigate(
          `/payment-success?orderId=${orderId}&mode=${paymentMethod}&amount=${total}&txnId=${form.transactionId}`
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        alert(
          "Failed to place order"
        );
      } finally {
        setPlacing(false);
      }
    };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white">
      <div className="w-full px-3 sm:px-5 lg:px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              💳 Checkout
            </h1>

            <p className="text-gray-500 mt-1">
              Complete your order
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/cart"
              )
            }
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10"
          >
            ← Back to Cart
          </button>
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* ADDRESS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-6">
                🚚 Delivery Address
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  name="fullName"
                  value={
                    form.fullName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Full Name"
                  className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 outline-none"
                />

                <input
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Phone Number"
                  className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 outline-none"
                />

                <input
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Pincode"
                  className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 outline-none"
                />

                <input
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="City"
                  className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 outline-none"
                />

                <input
                  name="state"
                  value={
                    form.state
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="State"
                  className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 outline-none md:col-span-2"
                />

                <textarea
                  rows="4"
                  name="addressLine"
                  value={
                    form.addressLine
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Full Address"
                  className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 outline-none md:col-span-2 resize-none"
                />

              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-6">
                💰 Payment Method
              </h2>

              <div className="space-y-4">

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "COD"
                    )
                  }
                  className={`w-full text-left p-4 rounded-2xl border ${
                    paymentMethod ===
                    "COD"
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                >
                  <p className="font-semibold">
                    💵 Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Pay after delivery
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "UPI"
                    )
                  }
                  className={`w-full text-left p-4 rounded-2xl border ${
                    paymentMethod ===
                    "UPI"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-200 dark:border-white/10"
                  }`}
                >
                  <p className="font-semibold">
                    📱 UPI Payment
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    GPay / PhonePe / Paytm
                  </p>
                </button>

                {paymentMethod ===
                  "UPI" && (
                  <div className="rounded-2xl bg-gray-100 dark:bg-slate-800 p-5 space-y-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Pay to UPI ID
                      </p>

                      <div className="flex justify-between gap-3 mt-1">
                        <p className="font-bold text-green-600 break-all">
                          {upiId}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              upiId,
                              "UPI ID"
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Or Pay to Number
                      </p>

                      <div className="flex justify-between gap-3 mt-1">
                        <p className="font-bold text-green-600">
                          {upiPhone}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            copyText(
                              upiPhone,
                              "Mobile Number"
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <input
                      name="transactionId"
                      value={
                        form.transactionId
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter UPI Transaction ID"
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 outline-none"
                    />

                    <p className="text-xs text-orange-500">
                      Order stays pending until admin verifies payment.
                    </p>

                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200 dark:border-white/10">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto">
                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="flex justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium">
                          {
                            item.productName
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₹
                        {Number(
                          item.priceAtTime
                        ) *
                          item.quantity}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 mt-6 pt-6 space-y-4">

                <div className="flex justify-between">
                  <span>
                    Subtotal
                  </span>
                  <span>
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Delivery
                  </span>
                  <span>
                    {delivery ===
                    0
                      ? "Free"
                      : `₹${delivery}`}
                  </span>
                </div>

                <div className="flex justify-between text-xl font-bold">
                  <span>
                    Total
                  </span>

                  <span className="text-green-500">
                    ₹{total}
                  </span>
                </div>

              </div>

              <button
                disabled={
                  placing ||
                  items.length ===
                    0
                }
                onClick={
                  placeOrder
                }
                className="mt-6 w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold"
              >
                {placing
                  ? "Processing..."
                  : paymentMethod ===
                    "UPI"
                  ? "Submit Payment"
                  : "Place Order"}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;