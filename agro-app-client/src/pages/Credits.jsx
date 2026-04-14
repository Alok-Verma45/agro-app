import { useEffect, useState } from "react";
import { getCredits, addCredit, addPayment } from "../api/creditApi";
import { getCustomers } from "../api/customerApi";
import { getProducts } from "../api/productApi";

function Credits() {
  const [credits, setCredits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    productId: "",
    quantity: "",
    paidAmount: "",
  });

  useEffect(() => {
    fetchCredits();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCredits = async () => {
    const res = await getCredits();
    setCredits(res.data);
  };

  const fetchCustomers = async () => {
    const res = await getCustomers();
    setCustomers(res.data);
  };

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleAddCredit = async () => {
    if (!form.customerId || !form.productId || !form.quantity) {
      alert("Customer, Product & Quantity required");
      return;
    }

    try {
      await addCredit(form.customerId, {
        product: { id: Number(form.productId) },
        quantity: Number(form.quantity),
        paidAmount: Number(form.paidAmount || 0),
      });

      setForm({
        customerId: "",
        productId: "",
        quantity: "",
        paidAmount: "",
      });

      setToast("Credit added");
      fetchCredits();
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      setToast("Error occurred");
    }
  };

  const handlePay = async (credit) => {
    const amount = prompt("Enter payment amount");
    if (!amount || isNaN(amount)) return;

    await addPayment(credit.id, Number(amount));
    setToast("Payment added 💰");
    fetchCredits();
    setTimeout(() => setToast(""), 2000);
  };

  const sortedCredits = [...credits].sort(
    (a, b) => b.pendingAmount - a.pendingAmount
  );

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6 
        text-gray-800 dark:text-white">
        Credits <span className="text-gray-500">(Udhar/Paid)</span>
      </h1>

      {/* FORM */}
      <div className="bg-white dark:bg-gray-800 
        p-6 rounded-2xl shadow-sm 
        border border-gray-200 dark:border-gray-700 mb-6">
        
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Add Credit
        </h2>

        <div className="flex gap-4 mb-4">
          
          <select
            className="border p-3 rounded-xl w-full 
              bg-white dark:bg-gray-700 
              text-gray-800 dark:text-white"
            value={form.customerId}
            onChange={(e) =>
              setForm({ ...form, customerId: e.target.value })
            }
          >
            <option value="">Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-xl w-full 
              bg-white dark:bg-gray-700 
              text-gray-800 dark:text-white"
            value={form.productId}
            onChange={(e) =>
              setForm({ ...form, productId: e.target.value })
            }
          >
            <option value="">Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₹{p.price})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Qty"
            className="border p-3 rounded-xl w-full 
              bg-white dark:bg-gray-700 
              text-gray-800 dark:text-white"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Paid"
            className="border p-3 rounded-xl w-full 
              bg-white dark:bg-gray-700 
              text-gray-800 dark:text-white"
            value={form.paidAmount}
            onChange={(e) =>
              setForm({ ...form, paidAmount: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddCredit}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Add Credit
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 
        p-6 rounded-2xl shadow-sm 
        border border-gray-200 dark:border-gray-700">

        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          All Credits
        </h2>

        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-500 dark:text-gray-300 text-sm uppercase">
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Paid</th>
              <th className="p-3 text-left">Pending</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedCredits.map((c, index) => (
              <tr
                key={c.id}
                className={`bg-white dark:bg-gray-700 
                  shadow-sm hover:shadow-md transition rounded-lg 
                  ${index === 0 ? "bg-red-50 dark:bg-red-900/30 font-semibold" : ""}`}
              >
                <td className="p-3">{c.customer?.name}</td>
                <td className="p-3">{c.product?.name}</td>
                <td className="p-3">{c.quantity}</td>

                <td className="p-3 text-blue-600">₹{c.totalAmount}</td>
                <td className="p-3 text-green-600">₹{c.paidAmount}</td>
                <td className="p-3 text-red-500">₹{c.pendingAmount}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      c.status === "PAID"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="p-3">
                  {c.status !== "PAID" && (
                    <button
                      onClick={() => handlePay(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 
          bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Credits;