import { useEffect, useState } from "react";
import {
  getCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
} from "../api/customerApi";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!form.name || !form.phone) {
      setToast("⚠️ नाम और फोन जरूरी है (Name & Phone required)");
      return;
    }

    try {
      if (editingId) {
        await updateCustomer(editingId, form);
        setToast("✅ ग्राहक अपडेट हुआ (Customer updated)");
      } else {
        await addCustomer(form);
        setToast("✅ ग्राहक जोड़ा गया (Customer added)");
      }

      setForm({ name: "", phone: "", address: "" });
      setEditingId(null);
      setShowForm(false);
      fetchCustomers();
    } catch {
      setToast("❌ कुछ गलत हुआ (Something went wrong)");
    } finally {
      setTimeout(() => setToast(""), 2000);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm("ग्राहक हटाना चाहते हो? (Delete customer?)")) return;

    await deleteCustomer(id);
    fetchCustomers();

    setToast("🗑️ ग्राहक हटाया गया (Customer deleted)");
    setTimeout(() => setToast(""), 2000);
  };

  const handleEditCustomer = (c) => {
    setForm({
      name: c.name,
      phone: c.phone,
      address: c.address,
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="py-6 space-y-6 animate-fadeIn">

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="🔍 ग्राहक खोजें (Search customers)..."
        className="w-full p-3 sm:p-4 rounded-xl 
        bg-white/5 backdrop-blur-xl
        border border-white/10
        text-white
        focus:ring-2 focus:ring-green-400 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📦 CARD */}
      <div className="bg-white/5 backdrop-blur-xl 
      border border-white/10 
      p-4 sm:p-6 rounded-2xl shadow-lg">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between 
        items-start sm:items-center gap-3 mb-6">

          <h1 className="text-xl sm:text-2xl font-bold">
            👥 ग्राहक सूची (Customers)
          </h1>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm({ name: "", phone: "", address: "" });
            }}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 
            text-white px-5 py-2 rounded-xl shadow-md transition hover:scale-105"
          >
            + नया ग्राहक
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">
              🚫 कोई ग्राहक नहीं मिला
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (No customers found)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row justify-between 
                sm:items-center gap-4 p-4 rounded-xl
                bg-white/5 hover:scale-[1.02] hover:shadow-lg transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center 
                  rounded-full bg-gradient-to-r from-green-500 to-emerald-500 
                  text-white font-bold text-lg">
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-lg">{c.name}</p>
                    <p className="text-sm text-gray-400">
                      📞 {c.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      📍 {c.address}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEditCustomer(c)}
                    className="px-3 py-1 rounded-lg 
                    bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCustomer(c.id)}
                    className="px-3 py-1 rounded-lg 
                    bg-red-500 hover:bg-red-600 text-white shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 MODAL */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center 
        bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white dark:bg-gray-800 
          p-6 rounded-2xl shadow-xl w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              {editingId
                ? "✏️ ग्राहक अपडेट करें"
                : "➕ नया ग्राहक"}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="नाम (Name)"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="फोन (Phone)"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="पता (Address)"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                Save
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

export default Customers;