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
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price) {
      setToast("⚠️ Name & Price required (नाम और कीमत जरूरी है)");
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setToast("✅ Product updated (उत्पाद अपडेट हुआ)");
      } else {
        await addProduct(form);
        setToast("✅ Product added (उत्पाद जोड़ा गया)");
      }

      setForm({ name: "", price: "", quantity: "" });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch {
      setToast("❌ Error occurred (कुछ गलत हुआ)");
    } finally {
      setTimeout(() => setToast(""), 2000);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product? (उत्पाद हटाना है?)")) return;

    await deleteProduct(id);
    fetchProducts();

    setToast("🗑️ Product deleted (उत्पाद हटाया गया)");
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
    <div className="py-6 space-y-6 animate-fadeIn">

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="🔍 उत्पाद खोजें (Search products)..."
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
            📦 उत्पाद सूची (Products)
          </h1>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm({ name: "", price: "", quantity: "" });
            }}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 
            text-white px-5 py-2 rounded-xl shadow-md transition hover:scale-105"
          >
            + नया उत्पाद
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">
              🚫 कोई उत्पाद नहीं मिला
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (No products found)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row justify-between 
                sm:items-center gap-4 p-4 rounded-xl
                bg-white/5 hover:scale-[1.02] hover:shadow-lg transition"
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
                    <p className="text-sm text-gray-400">
                      मात्रा (Qty): {p.quantity}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col sm:flex-row 
                items-start sm:items-center gap-3 sm:gap-6">

                  <span className="text-blue-500 font-bold text-lg">
                    ₹{p.price}
                  </span>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="px-3 py-1 rounded-lg 
                      bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="px-3 py-1 rounded-lg 
                      bg-red-500 hover:bg-red-600 text-white shadow-md"
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
        bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white dark:bg-gray-800 
          p-6 rounded-2xl shadow-xl w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              {editingId
                ? "✏️ उत्पाद संपादित करें"
                : "➕ नया उत्पाद"}
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
                placeholder="कीमत (Price)"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <input
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                placeholder="मात्रा (Quantity)"
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

export default Products;