import { useEffect, useState } from "react";
import { getCredits, addCredit, addPayment } from "../api/creditApi";
import { getCustomers } from "../api/customerApi";
import { getProducts } from "../api/productApi";

function Credits() {
  const [credits, setCredits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");
  const [showPayModal, setShowPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    customerId: "",
    productId: "",
    quantity: "",
    paidAmount: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [creditRes, custRes, prodRes] = await Promise.all([
        getCredits(),
        getCustomers(),
        getProducts(),
      ]);

      setCredits(creditRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredit = async () => {
    if (!form.customerId || !form.productId || !form.quantity) {
      setToast("⚠️ सभी फील्ड भरें (Fill all fields)");
      return;
    }

    await addCredit(form.customerId, {
      product: { id: Number(form.productId) },
      quantity: Number(form.quantity),
      paidAmount: Number(form.paidAmount || 0),
    });

    setForm({ customerId: "", productId: "", quantity: "", paidAmount: "" });
    setToast("✅ उधार जोड़ा गया (Credit added)");
    fetchAll();
    setTimeout(() => setToast(""), 2000);
  };

  const handlePay = async () => {
    if (!payAmount) return;

    await addPayment(showPayModal.id, Number(payAmount));

    setShowPayModal(null);
    setPayAmount("");
    setToast("💰 भुगतान सफल (Payment success)");
    fetchAll();
    setTimeout(() => setToast(""), 2000);
  };

  const sortedCredits = [...credits].sort(
    (a, b) => b.pendingAmount - a.pendingAmount
  );

  return (
    <div className="py-6 space-y-6 animate-fadeIn">

      {/* 🔥 HEADING */}
      <h1 className="text-2xl sm:text-3xl font-bold text-green-400">
        💳 उधार प्रबंधन (Credits Management)
      </h1>

      {/* 🔥 ADD CREDIT */}
      <div className="bg-white/5 backdrop-blur-xl 
      border border-white/10 
      p-4 sm:p-6 rounded-2xl shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          ➕ नया उधार जोड़ें (Add Credit)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          <select
            className="p-3 rounded-xl bg-white/10"
            value={form.customerId}
            onChange={(e) =>
              setForm({ ...form, customerId: e.target.value })
            }
          >
            <option value="">ग्राहक (Customer)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="p-3 rounded-xl bg-white/10"
            value={form.productId}
            onChange={(e) =>
              setForm({ ...form, productId: e.target.value })
            }
          >
            <option value="">उत्पाद (Product)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.price})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="मात्रा (Qty)"
            className="p-3 rounded-xl bg-white/10"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="भुगतान (Paid)"
            className="p-3 rounded-xl bg-white/10"
            value={form.paidAmount}
            onChange={(e) =>
              setForm({ ...form, paidAmount: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddCredit}
          className="mt-4 w-full sm:w-auto bg-green-500 hover:bg-green-600 
          px-6 py-2 rounded-xl text-white transition hover:scale-105"
        >
          Add Credit
        </button>
      </div>

      {/* 🔥 CREDIT LIST */}
      <div className="bg-white/5 backdrop-blur-xl 
      border border-white/10 
      p-4 sm:p-6 rounded-2xl shadow-lg">

        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          📋 सभी उधार (All Credits)
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : sortedCredits.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">
              🚫 कोई डेटा उपलब्ध नहीं
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (No data available)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCredits.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-xl flex flex-col sm:flex-row 
                sm:justify-between sm:items-center gap-3
                ${
                  c.pendingAmount > 0
                    ? "bg-red-500/10 border border-red-400/20"
                    : "bg-white/5"
                }
                hover:scale-[1.02] transition`}
              >
                {/* LEFT */}
                <div>
                  <p className="font-semibold text-lg">
                    {c.customer?.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {c.product?.name} • Qty: {c.quantity}
                  </p>
                </div>

                {/* MIDDLE */}
                <div className="flex flex-wrap gap-3 sm:gap-6 text-sm font-semibold">
                  <span className="text-blue-400">₹{c.totalAmount}</span>
                  <span className="text-green-400">₹{c.paidAmount}</span>
                  <span className="text-red-400">₹{c.pendingAmount}</span>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      c.status === "PAID"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {c.status}
                  </span>

                  {c.status !== "PAID" && (
                    <button
                      onClick={() => setShowPayModal(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 
                      text-white px-4 py-1 rounded-lg 
                      shadow-lg hover:scale-105 transition"
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 💰 MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 flex items-center justify-center 
        bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white dark:bg-gray-800 
          p-6 rounded-2xl shadow-xl w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              भुगतान करें (Make Payment)
            </h2>

            <input
              type="number"
              placeholder="Amount"
              className="w-full p-3 rounded-lg mb-4 bg-gray-100 dark:bg-gray-700"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPayModal(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handlePay}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 
        bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Credits;