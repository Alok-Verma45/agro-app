import { useEffect, useState } from "react";
import { getCart, removeItem, updateQuantity } from "../api/cartApi";
import { placeOrder } from "../api/orderApi";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // 🔥 NEW
  const [placingOrder, setPlacingOrder] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      console.log("🔥 CART DATA:", res.data);
      setCart(res.data);
    } catch (err) {
      console.error("❌ Fetch cart error:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOCAL UPDATE
  const updateLocalCart = (updatedItems) => {
    const total = updatedItems.reduce(
      (sum, i) => sum + i.priceAtTime * i.quantity,
      0,
    );

    setCart((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: total,
    }));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ➕ INCREASE
  const increaseQty = async (item) => {
    if (!item?.itemId) return;

    setUpdatingId(item.itemId);

    try {
      await updateQuantity(item.itemId, item.quantity + 1);

      const updated = cart.items.map((i) =>
        i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i,
      );

      updateLocalCart(updated);
    } finally {
      setUpdatingId(null);
    }
  };

  // ➖ DECREASE
  const decreaseQty = async (item) => {
    if (!item?.itemId) return;

    setUpdatingId(item.itemId);

    try {
      if (item.quantity <= 1) {
        await removeItem(item.itemId);

        const updated = cart.items.filter((i) => i.itemId !== item.itemId);

        updateLocalCart(updated);
      } else {
        await updateQuantity(item.itemId, item.quantity - 1);

        const updated = cart.items.map((i) =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity - 1 } : i,
        );

        updateLocalCart(updated);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // ❌ REMOVE
  const handleRemove = async (itemId) => {
    if (!itemId) return;

    setUpdatingId(itemId);

    try {
      await removeItem(itemId);

      const updated = cart.items.filter((i) => i.itemId !== itemId);

      updateLocalCart(updated);
    } finally {
      setUpdatingId(null);
    }
  };

  // 🔥 CHECKOUT
  const handleCheckout = async () => {
    try {
      setPlacingOrder(true);

      const res = await placeOrder();
      console.log("✅ ORDER RESPONSE:", res.data);

      // 🔥 show success FIRST
      setToast("🎉 Order placed successfully!");

      // 🔥 delay UI change
      setTimeout(() => {
        // cart clear after user sees message
        setCart({ items: [], totalAmount: 0 });

        window.dispatchEvent(new Event("cartUpdated"));

        // optional redirect
        window.location.href = "/home"; // ya /orders
      }, 1500);
    } catch (err) {
      console.error(err);

      setToast(err?.response?.data?.error || "❌ Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // 🧠 STATES
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Loading cart...
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-400">
        <div className="text-4xl">🛒</div>
        <p className="text-lg">Your cart is empty</p>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div
      className="min-h-screen px-4 py-6 
    bg-gray-100 dark:bg-gray-900 
    text-gray-800 dark:text-white"
    >
      {/* 🔙 BACK */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 mb-4 
        text-sm text-gray-500 dark:text-gray-400 
        hover:text-green-500 transition"
      >
        <span className="text-lg">←</span>
        Back
      </button>

      <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.itemId}
              className="flex justify-between items-center 
              bg-white dark:bg-gray-800 
              p-4 rounded-xl shadow"
            >
              <div>
                <p className="font-semibold text-lg">{item.productName}</p>
                <p className="text-sm text-gray-500">₹{item.priceAtTime}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item)}
                  disabled={updatingId === item.itemId}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item)}
                  disabled={updatingId === item.itemId}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  ₹{item.priceAtTime * item.quantity}
                </span>

                <button
                  onClick={() => handleRemove(item.itemId)}
                  className="text-red-500 text-lg"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div
          className="bg-white dark:bg-gray-800 
        p-5 rounded-xl shadow space-y-4 h-fit"
        >
          <h2 className="font-semibold text-lg">Order Summary</h2>

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
            <span className="text-green-500">₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={placingOrder}
            className="w-full py-3 bg-green-500 hover:bg-green-600 
            text-white rounded-xl font-semibold transition 
            disabled:opacity-50"
          >
            {placingOrder ? "Placing..." : "Checkout 🚀"}
          </button>
        </div>
      </div>

      {/* 🔔 TOAST */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 
  bg-green-600 text-white px-6 py-3 rounded-lg 
  shadow-xl text-sm font-medium animate-bounce"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default Cart;
