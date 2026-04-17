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
    const [creditRes, custRes, prodRes] = await Promise.all([
      getCredits(),
      getCustomers(),
      getProducts(),
    ]);

    setCredits(creditRes.data);
    setCustomers(custRes.data);
    setProducts(prodRes.data);
  };

  const handleAddCredit = async () => {
    if (!form.customerId || !form.productId || !form.quantity) {
      setToast("⚠️ सभी फील्ड भरें");
      return;
    }

    await addCredit(form.customerId, {
      product: { id: Number(form.productId) },
      quantity: Number(form.quantity),
      paidAmount: Number(form.paidAmount || 0),
    });

    setForm({ customerId: "", productId: "", quantity: "", paidAmount: "" });
    setToast("✅ उधार जोड़ा गया");
    fetchAll();
    setTimeout(() => setToast(""), 2000);
  };

  const handlePay = async () => {
    if (!payAmount) return;

    await addPayment(showPayModal.id, Number(payAmount));

    setShowPayModal(null);
    setPayAmount("");
    setToast("💰 भुगतान सफल");
    fetchAll();
    setTimeout(() => setToast(""), 2000);
  };

  const sortedCredits = [...credits].sort(
    (a, b) => b.pendingAmount - a.pendingAmount
  );

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 HEADING */}
      <h1 className="text-3xl font-bold text-green-400">
        💳 उधार प्रबंधन
      </h1>

      {/* 🔥 ADD CREDIT */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl 
      p-6 rounded-3xl shadow-xl border border-white/20">

        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          ➕ नया उधार जोड़ें
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select
            className="p-3 rounded-xl bg-white/60 dark:bg-gray-800"
            value={form.customerId}
            onChange={(e) =>
              setForm({ ...form, customerId: e.target.value })
            }
          >
            <option value="">ग्राहक</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="p-3 rounded-xl bg-white/60 dark:bg-gray-800"
            value={form.productId}
            onChange={(e) =>
              setForm({ ...form, productId: e.target.value })
            }
          >
            <option value="">उत्पाद</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.price})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="मात्रा"
            className="p-3 rounded-xl bg-white/60 dark:bg-gray-800"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Paid"
            className="p-3 rounded-xl bg-white/60 dark:bg-gray-800"
            value={form.paidAmount}
            onChange={(e) =>
              setForm({ ...form, paidAmount: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddCredit}
          className="mt-4 bg-gradient-to-r from-green-500 to-green-600 
          px-6 py-2 rounded-xl text-white hover:scale-105 transition"
        >
          Add Credit
        </button>
      </div>

      {/* 🔥 CREDIT LIST */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl 
      p-6 rounded-3xl shadow-xl border border-white/20">

        <h2 className="text-xl font-semibold mb-4">
          📋 सभी उधार
        </h2>

        <div className="space-y-4">
          {sortedCredits.map((c, i) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl flex justify-between items-center
              ${c.pendingAmount > 0
                ? "bg-red-100/50 dark:bg-red-900/20"
                : "bg-white/60 dark:bg-gray-800"}
              hover:scale-[1.01] transition`}
            >
              {/* LEFT */}
              <div>
                <p className="font-semibold text-lg">
                  {c.customer?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {c.product?.name} • Qty: {c.quantity}
                </p>
              </div>

              {/* MIDDLE */}
              <div className="flex gap-6 text-sm font-semibold">
                <span className="text-blue-500">₹{c.totalAmount}</span>
                <span className="text-green-500">₹{c.paidAmount}</span>
                <span className="text-red-500">₹{c.pendingAmount}</span>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    c.status === "PAID"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {c.status}
                </span>

                {c.status !== "PAID" && (
                  <button
                    onClick={() => setShowPayModal(c)}
                    className="bg-yellow-500 hover:bg-yellow-600 
                    text-white px-4 py-1 rounded-lg"
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 💰 PAY MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 flex items-center justify-center 
        bg-black/50 backdrop-blur-sm">

          <div className="bg-white dark:bg-gray-800 
          p-6 rounded-2xl shadow-xl w-[350px]">

            <h2 className="text-lg font-semibold mb-4">
              भुगतान करें
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
        bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Credits;