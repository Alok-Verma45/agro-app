import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCart,
  updateQuantity,
  removeItem as removeCartItem,
} from "../api/cartApi";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  // ==========================
  // LOAD CART
  // ==========================
  const loadCart = async () => {
    try {
      setLoading(true);

      const res = await getCart();

      setCart(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UPDATE QTY
  // ==========================
  const changeQty = async (
    itemId,
    qty
  ) => {
    if (qty < 1) return;

    try {
      setProcessingId(itemId);

      await updateQuantity(
        itemId,
        qty
      );

      await loadCart();

      window.dispatchEvent(
        new Event(
          "cartUpdated"
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================
  // REMOVE ITEM
  // ==========================
  const removeItem = async (
    itemId
  ) => {
    try {
      setProcessingId(itemId);

      await removeCartItem(
        itemId
      );

      await loadCart();

      window.dispatchEvent(
        new Event(
          "cartUpdated"
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center">
        Loading cart...
      </div>
    );
  }

  const items =
    cart?.items || [];

  const subtotal = Number(
    cart?.totalAmount || 0
  );

  const delivery =
    subtotal > 999 ||
    subtotal === 0
      ? 0
      : 60;

  const total =
    subtotal + delivery;

  // ==========================
  // EMPTY CART
  // ==========================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-white/5">
          <div className="text-7xl mb-4">
            🛒
          </div>

          <h1 className="text-3xl font-bold">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Add products to start shopping.
          </p>

          <button
            onClick={() =>
              navigate("/home")
            }
            className="mt-6 px-6 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="w-full px-3 sm:px-5 lg:px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              🛒 Shopping Cart
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {items.length} items in your cart
            </p>
          </div>

          <Link
            to="/home"
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT ITEMS */}
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => (
              <div
                key={
                  item.itemId
                }
                className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-5"
              >
                <div className="grid md:grid-cols-[120px_1fr] gap-5">

                  {/* IMAGE */}
                  <div className="h-28 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-5xl">
                    🌾
                  </div>

                  {/* CONTENT */}
                  <div>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div>
                        <h2 className="text-xl font-semibold">
                          {
                            item.productName
                          }
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                          Premium agriculture product
                        </p>

                        <p className="text-green-500 text-2xl font-bold mt-3">
                          ₹
                          {
                            item.priceAtTime
                          }
                        </p>
                      </div>

                      <button
                        disabled={
                          processingId ===
                          item.itemId
                        }
                        onClick={() =>
                          removeItem(
                            item.itemId
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                      >
                        Remove
                      </button>
                    </div>

                    {/* QTY */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                      <div className="flex items-center gap-3">
                        <button
                          disabled={
                            processingId ===
                            item.itemId
                          }
                          onClick={() =>
                            changeQty(
                              item.itemId,
                              item.quantity -
                                1
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-800"
                        >
                          -
                        </button>

                        <div className="w-12 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                          {
                            item.quantity
                          }
                        </div>

                        <button
                          disabled={
                            processingId ===
                            item.itemId
                          }
                          onClick={() =>
                            changeQty(
                              item.itemId,
                              item.quantity +
                                1
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-800"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Subtotal
                        </p>

                        <p className="text-xl font-bold">
                          ₹
                          {item.priceAtTime *
                            item.quantity}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SUMMARY */}
          <div>
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-white/5 p-6">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>

                  <span>
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Delivery
                  </span>

                  <span>
                    {delivery === 0
                      ? "Free"
                      : `₹${delivery}`}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>

                  <span className="text-green-500">
                    ₹{total}
                  </span>
                </div>
              </div>

              {subtotal < 999 && (
                <p className="mt-4 text-sm text-orange-500">
                  Add ₹
                  {999 -
                    subtotal}{" "}
                  more for free delivery 🚚
                </p>
              )}

              <button
                onClick={() =>
                  navigate(
                    "/checkout"
                  )
                }
                className="mt-6 w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold text-lg"
              >
                Proceed to Checkout
              </button>

              <div className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  🔒 Secure Checkout
                </p>
                <p>
                  💵 Cash on Delivery
                </p>
                <p>
                  🚚 Fast Delivery
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;