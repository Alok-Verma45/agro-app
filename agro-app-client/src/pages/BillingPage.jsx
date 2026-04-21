import { useEffect, useState } from "react";
import { getCustomers } from "../api/customerApi";
import { getProducts } from "../api/productApi";

function BillingPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    items: [{ productId: "", quantity: "", price: "" }],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [custRes, prodRes] = await Promise.all([
      getCustomers(),
      getProducts(),
    ]);
    setCustomers(custRes.data);
    setProducts(prodRes.data);
  };

  const updateItem = (index, field, value) => {
    const updated = [...form.items];

    if (field === "productId") {
      const product = products.find((p) => p.id === Number(value));
      updated[index].productId = value;
      updated[index].price = product?.price || "";
    } else {
      updated[index][field] = value === "" ? "" : Math.max(0, Number(value));
    }

    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { productId: "", quantity: "", price: "" }],
    });
  };

  const removeItem = (index) => {
    if (form.items.length === 1) return;
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const subtotal = form.items.reduce((sum, item) => {
    const q = Number(item.quantity || 0);
    const p = Number(item.price || 0);
    return sum + q * p;
  }, 0);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleGenerate = () => {
    if (!form.customerId) {
      setToast("⚠️ Customer select karo");
      return;
    }

    const validItems = form.items.filter((i) => i.productId && i.quantity > 0);

    if (validItems.length === 0) {
      setToast("⚠️ Valid items add karo");
      return;
    }

    setToast(`🧾 Invoice Generated: ₹${total.toFixed(2)}`);
    setTimeout(() => setToast(""), 2000);
  };

  const isItemValid = (item) => item.productId && item.quantity > 0;

  return (
    <div className="py-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-500 dark:text-green-400">
          🧾 Billing System
        </h1>

        {/* SUMMARY */}
        <div
          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 
        rounded-xl px-4 py-3 flex flex-wrap justify-between items-center gap-4 shadow-sm"
        >
          <div>
            <p className="text-xs text-gray-500">Subtotal</p>
            <p className="font-semibold">₹{subtotal.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">GST (18%)</p>
            <p className="font-semibold">₹{gst.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-bold text-green-600 text-lg">
              ₹{total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
      p-4 sm:p-6 rounded-2xl shadow-xl space-y-6"
      >
        {/* CUSTOMER */}
        <select
          className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 w-full text-gray-900 dark:text-white"
          style={{ colorScheme: "light dark" }}
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: e.target.value })}
        >
          <option
            value=""
            className="text-black bg-white dark:text-white dark:bg-gray-900"
          >
            Select Customer
          </option>
          {customers.map((c) => (
            <option
              key={c.id}
              value={c.id}
              className="text-black bg-white dark:text-white dark:bg-gray-900"
            >
              {c.name}
            </option>
          ))}
        </select>

        {!form.customerId && (
          <p className="text-sm text-gray-500">
            Please select a customer to enable billing
          </p>
        )}

        {/* HEADER */}
        <div className="hidden sm:grid grid-cols-5 gap-3 text-gray-500 text-sm">
          <span className="px-3">Product</span>
          <span className="px-3">Qty</span>
          <span className="px-3">Price</span>
          <span className="text-center">Total</span>
          <span className="text-center">Action</span>
        </div>

        {/* ITEMS */}
        {/* ITEMS */}
        {form.items.map((item, index) => {
          const rowTotal = (item.quantity || 0) * (item.price || 0);

          return (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center"
            >
              <select
                disabled={!form.customerId}
                className="px-3 py-2 h-10 rounded bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                style={{ colorScheme: "light dark" }}
                value={item.productId}
                onChange={(e) => updateItem(index, "productId", e.target.value)}
              >
                <option
                  value=""
                  className="text-black bg-white dark:text-white dark:bg-gray-900"
                >
                  Product
                </option>
                {products.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    className="text-black bg-white dark:text-white dark:bg-gray-900"
                  >
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                disabled={!form.customerId}
                placeholder="Qty"
                className="px-3 py-2 h-10 rounded bg-gray-100 dark:bg-white/10"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />

              <input
                type="number"
                disabled
                className="px-3 py-2 h-10 rounded bg-gray-200 dark:bg-white/5 cursor-not-allowed"
                value={item.price}
              />

              <div className="font-semibold text-center">
                ₹{rowTotal.toFixed(2)}
              </div>

              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 p-2 rounded text-lg"
              >
                ❌
              </button>
            </div>
          );
        })}

        {/* ACTIONS */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <button
            onClick={addItem}
            disabled={!form.customerId}
            className="bg-blue-500 disabled:bg-gray-400 px-4 py-2 rounded-lg text-white"
          >
            + Add Item
          </button>

          <button
            onClick={handleGenerate}
            disabled={!form.customerId || subtotal === 0}
            className="bg-green-500 disabled:bg-gray-400 px-6 py-2 rounded-lg text-white"
          >
            Generate Invoice
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default BillingPage;
