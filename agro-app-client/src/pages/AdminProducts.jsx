import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

function AdminProducts() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [toast, setToast] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      quantity: "",
      description: "",
      category: "",
      image: null,
      preview: "",
      oldImage: "",
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

  const showToast = (
    msg
  ) => {
    setToast(msg);

    setTimeout(
      () =>
        setToast(""),
      2000
    );
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      quantity: "",
      description: "",
      category: "",
      image: null,
      preview: "",
      oldImage: "",
    });

    setEditingId(
      null
    );

    setShowForm(
      false
    );
  };

  const openAddModal =
    () => {
      resetForm();
      setShowForm(
        true
      );
    };

  const openEditModal =
    (p) => {
      setEditingId(
        p.id
      );

      setForm({
        name: p.name,
        price: p.price,
        quantity:
          p.quantity,
        description:
          p.description ||
          "",
        category:
          p.category ||
          "",
        image: null,
        preview: "",
        oldImage:
          p.imageUrl ||
          "",
      });

      setShowForm(
        true
      );
    };

  const handleSave =
    async () => {
      if (
        !form.name ||
        !form.price
      ) {
        showToast(
          "⚠️ Name & Price required"
        );
        return;
      }

      const data =
        new FormData();

      data.append(
        "name",
        form.name
      );

      data.append(
        "price",
        form.price
      );

      data.append(
        "quantity",
        form.quantity ||
          0
      );

      data.append(
        "description",
        form.description
      );

      data.append(
        "category",
        form.category
      );

      if (
        form.image
      ) {
        data.append(
          "image",
          form.image
        );
      }

      try {
        if (
          editingId
        ) {
          await updateProduct(
            editingId,
            data
          );

          showToast(
            "✅ Product updated"
          );
        } else {
          if (
            !form.image
          ) {
            showToast(
              "⚠️ Product image required"
            );
            return;
          }

          await addProduct(
            data
          );

          showToast(
            "✅ Product added"
          );
        }

        resetForm();
        fetchProducts();
      } catch (
        err
      ) {

        const message =
          err?.response
            ?.data
            ?.message;

        if (
          message ===
          "Product already exists"
        ) {
          showToast(
            "⚠️ Product already exists"
          );
        } else {
          showToast(
            "❌ Request failed"
          );
        }
      }
    };

  const handleDelete =
    async (id) => {
      if (
        !confirm(
          "Delete this product?"
        )
      )
        return;

      try {
        await deleteProduct(
          id
        );

        showToast(
          "🗑️ Product deleted"
        );

        fetchProducts();
      } catch {
        showToast(
          "❌ Delete failed"
        );
      }
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

  return (
    <div className="py-6 space-y-6">

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

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            📦 Admin Products
          </h1>

          <button
            onClick={
              openAddModal
            }
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl"
          >
            + New Product
          </button>

        </div>

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

                    <img
                      src={
                        p.imageUrl
                      }
                      alt={
                        p.name
                      }
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
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

                  <div className="flex items-center gap-3">

                    <span className="text-green-400 font-bold">
                      ₹
                      {
                        p.price
                      }
                    </span>

                    <button
                      onClick={() =>
                        openEditModal(
                          p
                        )
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
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

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              {editingId
                ? "Edit Product"
                : "New Product"}
            </h2>

            <div className="space-y-3">

              <input
                placeholder="Name"
                value={
                  form.name
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                placeholder="Price"
                value={
                  form.price
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                placeholder="Quantity"
                value={
                  form.quantity
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    quantity:
                      e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                placeholder="Description"
                value={
                  form.description
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                placeholder="Category"
                value={
                  form.category
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(
                  e
                ) => {
                  const file =
                    e.target
                      .files[0];

                  if (
                    file
                  ) {
                    setForm({
                      ...form,
                      image: file,
                      preview:
                        URL.createObjectURL(
                          file
                        ),
                    });
                  }
                }}
                className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700"
              />

              {(form.preview ||
                form.oldImage) && (
                <img
                  src={
                    form.preview ||
                    form.oldImage
                  }
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border"
                />
              )}

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={
                  resetForm
                }
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleSave
                }
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;