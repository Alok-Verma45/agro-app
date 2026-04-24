import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";
import { placeOrder } from "../api/orderApi";
import axios from "axios";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [toast, setToast] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: "",
  });

  useEffect(() => {
    fetchCart();
    loadRazorpayScript();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    return (
      address.fullName &&
      address.phone &&
      address.pincode &&
      address.city &&
      address.state &&
      address.addressLine
    );
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  // ===================================
  // COMMON ORDER DATA
  // ===================================
  const orderPayload = {
    fullName: address.fullName,
    phone: address.phone,
    pincode: address.pincode,
    city: address.city,
    state: address.state,
    addressLine: address.addressLine,
  };

  // ===================================
  // COD ORDER
  // ===================================
  const placeCODOrder = async () => {
    try {
      setPlacingOrder(true);

      await placeOrder(orderPayload);

      showToast("🎉 Order placed successfully");

      setTimeout(() => {
        navigate("/payment-success", {
          state: {
            paymentMethod: "COD",
            paymentId: "cash_on_delivery",
          },
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ===================================
  // DEV PAYMENT MODE
  // ===================================
  const payWithRazorpayDev = async () => {
    try {
      setPlacingOrder(true);

      showToast("🔄 Processing payment...");

      setTimeout(async () => {
        await placeOrder(orderPayload);

        showToast("🎉 Payment Success");

        navigate("/payment-success", {
          state: {
            paymentMethod: "RAZORPAY",
            paymentId: "pay_dev_123456",
            orderId: "order_dev_789456",
            amount: total,
          },
        });
      }, 1800);
    } catch (err) {
      console.error(err);
      showToast("❌ Payment failed");
    } finally {
      setTimeout(() => {
        setPlacingOrder(false);
      }, 1800);
    }
  };

  // ===================================
  // LIVE RAZORPAY
  // ===================================
  const payWithRazorpayLive = async () => {
    try {
      setPlacingOrder(true);

      const res = await axios.post(
        "http://localhost:8080/api/payments/create-order",
        {
          amount: Math.round(total * 100),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data;

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Agro App",
        description: "Order Payment",
        order_id: data.orderId,

        handler: async function (response) {
          await axios.post(
            "http://localhost:8080/api/payments/verify",
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          await placeOrder(orderPayload);

          navigate("/payment-success", {
            state: {
              paymentMethod: "RAZORPAY",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: total,
            },
          });
        },

        prefill: {
          name: address.fullName,
          contact: address.phone,
        },

        theme: {
          color: "#22c55e",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.error(err);
      showToast("❌ Razorpay failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  // ===================================
  // MAIN ACTION
  // ===================================
  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      showToast("⚠️ Fill all address fields");
      return;
    }

    if (paymentMethod === "COD") {
      await placeCODOrder();
      return;
    }

    await payWithRazorpayDev();

    // future:
    // await payWithRazorpayLive();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="text-4xl">🛒</div>
        <p>Your cart is empty</p>

        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

      <button
        onClick={() => navigate(-1)}
        className="mb-5 text-sm hover:text-green-500"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* ADDRESS */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Delivery Address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["fullName", "Full Name"],
                ["phone", "Phone Number"],
                ["pincode", "Pincode"],
                ["city", "City"],
                ["state", "State"],
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  value={address[name]}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-lg border dark:bg-gray-900"
                />
              ))}

              <input
                name="addressLine"
                placeholder="House No / Area / Street"
                value={address.addressLine}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border dark:bg-gray-900 sm:col-span-2"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Payment Method
            </h2>

            <div className="space-y-3">

              <label className="flex gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <label className="flex gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                />
                Pay Online (Razorpay)
              </label>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow h-fit space-y-4">

          <h2 className="font-semibold text-lg">
            Order Summary
          </h2>

          {cart.items.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between text-sm"
            >
              <span>
                {item.productName} × {item.quantity}
              </span>

              <span>
                ₹{item.priceAtTime * item.quantity}
              </span>
            </div>
          ))}

          <hr />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-500">
              ₹{total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold disabled:opacity-50"
          >
            {placingOrder ? "Processing..." : "Place Order 🚀"}
          </button>

        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Checkout;