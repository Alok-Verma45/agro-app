import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../api/productApi";

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price) {
      setToast("⚠️ Name & Price required");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setToast("✅ Product updated");
      } else {
        await addProduct(form);
        setToast("✅ Product added");
      }

      setForm({ name: "", price: "", quantity: "" });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch {
      setToast("❌ Error occurred");
    } finally {
      setLoading(false);
      setTimeout(() => setToast(""), 2000);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await deleteProduct(id);
    fetchProducts();

    setToast("🗑️ Product deleted");
    setTimeout(() => setToast(""), 2000);
  };

  const handleEditProduct = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      quantity: p.quantity,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.price.toString().includes(search)
  );

  return (
    <div className="p-6 space-y-6">

      {/* 🔍 PREMIUM SEARCH */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 उत्पाद खोजें..."
          className="w-full p-4 rounded-2xl 
          bg-white/70 dark:bg-white/10 backdrop-blur-lg
          border border-white/20
          text-gray-800 dark:text-white
          focus:ring-2 focus:ring-green-400 outline-none
          shadow-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📦 MAIN CARD */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl 
        p-6 rounded-3xl shadow-xl border border-white/20">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            📦 उत्पाद सूची
          </h1>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm({ name: "", price: "", quantity: "" });
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 
            hover:scale-105 active:scale-95
            text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            + नया उत्पाद
          </button>
        </div>

        {/* LIST */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            कोई उत्पाद नहीं मिला 😕
          </p>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-4 rounded-xl
                bg-white/60 dark:bg-gray-800
                hover:shadow-lg hover:scale-[1.01]
                transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center 
                  rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 
                  text-white font-bold text-lg">
                    {p.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-sm text-gray-500">
                      मात्रा: {p.quantity}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">

                  <span className="text-blue-500 font-bold text-lg">
                    ₹{p.price}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="px-3 py-1 rounded-lg 
                      bg-blue-500 hover:bg-blue-600 text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="px-3 py-1 rounded-lg 
                      bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      Delete
                    </button>
                  </div>
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
            p-6 rounded-2xl shadow-xl w-[400px] animate-scaleIn">

            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {editingId ? "✏️ उत्पाद संपादित करें" : "➕ नया उत्पाद"}
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
                placeholder="कीमत"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="मात्रा"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
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
                onClick={handleAddProduct}
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

export default Products;