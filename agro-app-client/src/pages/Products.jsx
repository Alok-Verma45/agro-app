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
      alert("Name and Price required");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setToast("Product updated");
      } else {
        await addProduct(form);
        setToast("Product added");
      }

      setForm({ name: "", price: "", quantity: "" });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();

      setTimeout(() => setToast(""), 2000);
    } catch {
      setToast("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure?")) return;

    await deleteProduct(id);
    fetchProducts();

    setToast("Product deleted");
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
    <div className="p-6">

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or price..."
        className="border p-3 rounded-xl mb-6 w-full shadow-sm
        bg-white dark:bg-gray-800
        text-gray-800 dark:text-white
        border-gray-200 dark:border-gray-700
        focus:ring-2 focus:ring-green-400 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📦 Card */}
      <div className="bg-white dark:bg-gray-800 
        p-6 rounded-2xl shadow-sm 
        border border-gray-200 dark:border-gray-700">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold 
            text-gray-800 dark:text-white">
            Products
          </h1>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm({ name: "", price: "", quantity: "" });
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            + Add Product
          </button>
        </div>

        {/* Table */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            No products found 😕
          </p>
        ) : (
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300 text-sm uppercase">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white dark:bg-gray-700 
                  shadow-sm hover:shadow-md transition rounded-lg"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>

                  <td className="p-3 font-medium text-blue-600">
                    ₹{p.price}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-sm 
                      bg-gray-100 dark:bg-gray-600 
                      text-gray-800 dark:text-white">
                      {p.quantity}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 
            p-6 rounded-2xl shadow-lg w-[400px]">

            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <input
                className="border p-2 rounded 
                bg-white dark:bg-gray-700 
                text-gray-800 dark:text-white"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                className="border p-2 rounded 
                bg-white dark:bg-gray-700 
                text-gray-800 dark:text-white"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <input
                className="border p-2 rounded 
                bg-white dark:bg-gray-700 
                text-gray-800 dark:text-white"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddProduct}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Products;