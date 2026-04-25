import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../api/productApi";

function Products() {
  const [products, setProducts] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [toast, setToast] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      quantity: "",
      imageUrl: "",
    });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const res =
          await getProducts();

        setProducts(
          res.data
        );
      } catch (err) {
        console.error(
          err
        );
      } finally {
        setLoading(false);
      }
    };

  const handleAddProduct =
    async () => {
      if (
        !form.name ||
        !form.price
      ) {
        setToast(
          "⚠️ Name & Price required"
        );
        return;
      }

      const payload = {
        name: form.name,
        price: Number(
          form.price
        ),
        quantity:
          form.quantity
            ? Number(
                form.quantity
              )
            : 0,
        imageUrl:
          form.imageUrl,
      };

      try {
        if (
          editingId
        ) {
          await updateProduct(
            editingId,
            payload
          );

          setToast(
            "✅ Product updated"
          );
        } else {
          await addProduct(
            payload
          );

          setToast(
            "✅ Product added"
          );
        }

        setForm({
          name: "",
          price: "",
          quantity: "",
          imageUrl: "",
        });

        setEditingId(
          null
        );

        setShowForm(
          false
        );

        fetchProducts();
      } catch {
        setToast(
          "❌ Error occurred"
        );
      } finally {
        setTimeout(
          () =>
            setToast(
              ""
            ),
          2000
        );
      }
    };

  const handleDeleteProduct =
    async (id) => {
      if (
        !confirm(
          "Delete this product?"
        )
      )
        return;

      await deleteProduct(
        id
      );

      fetchProducts();

      setToast(
        "🗑️ Product deleted"
      );

      setTimeout(
        () =>
          setToast(""),
        2000
      );
    };

  const handleEditProduct =
    (p) => {
      setForm({
        name: p.name,
        price: p.price,
        quantity:
          p.quantity,
        imageUrl:
          p.imageUrl ||
          "",
      });

      setEditingId(
        p.id
      );

      setShowForm(
        true
      );
    };

  const filteredProducts =
    products.filter(
      (p) =>
        p.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        p.price
          .toString()
          .includes(
            search
          )
    );

  const getImageUrl =
    (path) => {
      if (!path)
        return "https://via.placeholder.com/80?text=No+Image";

      return `http://localhost:8080${path}`;
    };

  return (
    <div className="py-6 space-y-6">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search products..."
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
        value={search}
        onChange={(
          e
        ) =>
          setSearch(
            e.target
              .value
          )
        }
      />

      {/* CARD */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            📦 Products
          </h1>

          <button
            onClick={() => {
              setShowForm(
                true
              );

              setEditingId(
                null
              );

              setForm({
                name: "",
                price: "",
                quantity:
                  "",
                imageUrl:
                  "",
              });
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl"
          >
            + New Product
          </button>

        </div>

        {/* LIST */}
        {loading ? (
          <p>
            Loading...
          </p>
        ) : filteredProducts.length ===
          0 ? (
          <p>
            No products found
          </p>
        ) : (
          <div className="space-y-4">

            {filteredProducts.map(
              (p) => (
                <div
                  key={
                    p.id
                  }
                  className="flex justify-between items-center p-4 rounded-xl bg-white/5"
                >

                  <div className="flex items-center gap-4">

                    {/* PRODUCT IMAGE */}
                    <img
                      src={getImageUrl(
                        p.imageUrl
                      )}
                      alt={
                        p.name
                      }
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
                      onError={(
                        e
                      ) => {
                        e.target.src =
                          "https://via.placeholder.com/80?text=No+Image";
                      }}
                    />

                    <div>
                      <p className="font-semibold">
                        {
                          p.name
                        }
                      </p>

                      <p className="text-sm text-gray-400">
                        Qty:{" "}
                        {
                          p.quantity
                        }
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <span className="text-green-400 font-bold">
                      ₹
                      {
                        p.price
                      }
                    </span>

                    <button
                      onClick={() =>
                        handleEditProduct(
                          p
                        )
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteProduct(
                          p.id
                        )
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              {editingId
                ? "Edit Product"
                : "New Product"}
            </h2>

            <div className="flex flex-col gap-3">

              <input
                placeholder="Name"
                value={
                  form.name
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    {
                      ...form,
                      name: e
                        .target
                        .value,
                    }
                  )
                }
                className="p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                placeholder="Price"
                value={
                  form.price
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    {
                      ...form,
                      price:
                        e
                          .target
                          .value,
                    }
                  )
                }
                className="p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                placeholder="Quantity"
                value={
                  form.quantity
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    {
                      ...form,
                      quantity:
                        e
                          .target
                          .value,
                    }
                  )
                }
                className="p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                placeholder="/products/urea.jpg"
                value={
                  form.imageUrl
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    {
                      ...form,
                      imageUrl:
                        e
                          .target
                          .value,
                    }
                  )
                }
                className="p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              {/* IMAGE PREVIEW */}
              {form.imageUrl && (
                <img
                  src={getImageUrl(
                    form.imageUrl
                  )}
                  alt="Preview"
                  className="w-full h-40 rounded-xl object-cover border"
                  onError={(
                    e
                  ) => {
                    e.target.style.display =
                      "none";
                  }}
                />
              )}

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() =>
                  setShowForm(
                    false
                  )
                }
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleAddProduct
                }
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Products;