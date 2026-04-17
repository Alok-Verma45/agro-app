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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await getCustomers();
    setCustomers(res.data);
  };

  const handleAddCustomer = async () => {
    if (!form.name || !form.phone) {
      setToast("⚠️ नाम और फोन जरूरी है");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateCustomer(editingId, form);
        setToast("✅ ग्राहक अपडेट हुआ");
      } else {
        await addCustomer(form);
        setToast("✅ ग्राहक जोड़ा गया");
      }

      setForm({ name: "", phone: "", address: "" });
      setEditingId(null);
      setShowForm(false);
      fetchCustomers();
    } catch {
      setToast("❌ कुछ गलत हुआ");
    } finally {
      setLoading(false);
      setTimeout(() => setToast(""), 2000);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm("ग्राहक हटाना चाहते हो?")) return;

    await deleteCustomer(id);
    fetchCustomers();

    setToast("🗑️ ग्राहक हटाया गया");
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
    <div className="p-6 space-y-6">

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="🔍 ग्राहक खोजें..."
        className="w-full p-4 rounded-2xl 
        bg-white/70 dark:bg-white/10 backdrop-blur-lg
        border border-white/20
        text-gray-800 dark:text-white
        focus:ring-2 focus:ring-green-400 outline-none shadow-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📦 MAIN CARD */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl 
      p-6 rounded-3xl shadow-xl border border-white/20">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">
            👥 ग्राहक सूची
          </h1>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm({ name: "", phone: "", address: "" });
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 
            hover:scale-105 active:scale-95
            text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            + नया ग्राहक
          </button>
        </div>

        {/* LIST */}
        {filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            कोई ग्राहक नहीं मिला 😕
          </p>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center p-4 rounded-xl
                bg-white/60 dark:bg-gray-800
                hover:shadow-lg hover:scale-[1.01] transition"
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
                    <p className="text-sm text-gray-500">
                      📞 {c.phone}
                    </p>
                    <p className="text-sm text-gray-400">
                      📍 {c.address}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCustomer(c)}
                    className="px-3 py-1 rounded-lg 
                    bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCustomer(c.id)}
                    className="px-3 py-1 rounded-lg 
                    bg-red-500 hover:bg-red-600 text-white"
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
        bg-black/50 backdrop-blur-sm">

          <div className="bg-white dark:bg-gray-800 
          p-6 rounded-2xl shadow-xl w-[400px]">

            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {editingId ? "✏️ ग्राहक अपडेट करें" : "➕ नया ग्राहक"}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="नाम"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="फोन"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="पता"
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
                disabled={loading}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                {loading ? "Saving..." : "Save"}
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

export default Customers;