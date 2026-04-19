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
      updated[index][field] = value === "" ? "" : Number(value);
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

    const validItems = form.items.filter(
      (i) => i.productId && i.quantity > 0
    );

    if (validItems.length === 0) {
      setToast("⚠️ Valid items add karo");
      return;
    }

    setToast(`🧾 Invoice Generated: ₹${total.toFixed(2)}`);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="py-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-500 dark:text-green-400">
          🧾 Billing System
        </h1>

        {/* SUMMARY */}
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 
        p-4 rounded-xl text-sm text-gray-800 dark:text-white shadow">
          <p>Subtotal: ₹{subtotal}</p>
          <p>GST (18%): ₹{gst.toFixed(2)}</p>
          <p className="text-green-600 dark:text-green-400 font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10
      p-4 sm:p-6 rounded-2xl shadow-xl space-y-6 text-gray-800 dark:text-white">

        {/* CUSTOMER */}
        <select
          className="p-3 rounded-xl bg-gray-100 dark:bg-white/10 w-full outline-none text-gray-900 dark:text-white"
          style={{ colorScheme: 'light dark' }}
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: e.target.value })}
        >
          <option value="" className="text-black bg-white dark:text-white dark:bg-gray-900">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id} className="text-black bg-white dark:text-white dark:bg-gray-900">{c.name}</option>
          ))}
        </select>

        {/* EMPTY STATE */}
        {!form.customerId && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please select a customer and add items
          </p>
        )}

        {/* TABLE HEADER */}
        <div className="hidden sm:grid grid-cols-5 text-gray-600 dark:text-gray-400 text-sm">
          <span>Product</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Total</span>
          <span>Action</span>
        </div>

        {/* ITEMS */}
        {form.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">

            <select
              className="p-2 rounded bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
              style={{ colorScheme: 'light dark' }}
              value={item.productId}
              onChange={(e) => updateItem(index, "productId", e.target.value)}
            >
              <option value="" className="text-black bg-white dark:text-white dark:bg-gray-900">Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} className="text-black bg-white dark:text-white dark:bg-gray-900">
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Qty"
              min="1"
              className="p-2 rounded bg-gray-100 dark:bg-white/10 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              className="p-2 rounded bg-gray-100 dark:bg-white/10 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
              value={item.price}
              onChange={(e) => updateItem(index, "price", e.target.value)}
            />

            <div className="font-semibold text-center">
              ₹{(item.quantity || 0) * (item.price || 0)}
            </div>

            <button
              onClick={() => removeItem(index)}
              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 p-2 rounded transition"
            >
              🗑️
            </button>
          </div>
        ))}

        {/* ACTIONS */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <button
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
          >
            + Add Item
          </button>

          <button
            onClick={handleGenerate}
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white"
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
