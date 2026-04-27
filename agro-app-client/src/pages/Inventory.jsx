import { useEffect, useMemo, useState } from "react";
import { getProducts, updateProductStock } from "../api/productApi";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("DEFAULT");

  const [selected, setSelected] = useState(null);
  const [stockValue, setStockValue] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MODAL OPEN
  // =========================
  const openEditModal = (product) => {
    setSelected(product);
    setStockValue(product.quantity);
  };

  const closeModal = () => {
    setSelected(null);
    setStockValue("");
  };

  // =========================
  // FRONTEND UPDATE
  // Later replace with API
  // =========================
  const saveStock = async () => {
    try {
      await updateProductStock(selected.id, Number(stockValue));

      await fetchProducts();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const quickAddStock = async (id, currentQty) => {
    try {
      await updateProductStock(id, currentQty + 10);

      await fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // FILTER + SORT + SEARCH
  // =========================
  const filteredProducts = useMemo(() => {
    let data = [...products];

    data = data.filter((p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()),
    );

    if (filter === "LOW") {
      data = data.filter((p) => p.quantity > 0 && p.quantity <= 10);
    }

    if (filter === "OUT") {
      data = data.filter((p) => p.quantity === 0);
    }

    if (filter === "GOOD") {
      data = data.filter((p) => p.quantity > 10);
    }

    if (sort === "LOWEST") {
      data.sort((a, b) => a.quantity - b.quantity);
    }

    if (sort === "HIGHEST") {
      data.sort((a, b) => b.quantity - a.quantity);
    }

    if (sort === "PRICE") {
      data.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return data;
  }, [products, search, filter, sort]);

  // =========================
  // KPI
  // =========================
  const totalProducts = products.length;

  const lowStock = products.filter(
    (p) => Number(p.quantity) > 0 && Number(p.quantity) <= 10,
  ).length;

  const outStock = products.filter((p) => p.quantity === 0).length;

  const totalUnits = products.reduce((sum, p) => sum + Number(p.quantity), 0);

  const stockValueTotal = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity),
    0,
  );

  const getStatus = (qty) => {
    if (qty === 0)
      return {
        text: "OUT",
        color: "bg-red-500/20 text-red-400",
      };

    if (qty <= 10)
      return {
        text: "LOW",
        color: "bg-yellow-500/20 text-yellow-400",
      };

    return {
      text: "GOOD",
      color: "bg-green-500/20 text-green-400",
    };
  };

  return (
    <div className="py-6 space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-400">📦 Inventory V2</h1>

          <p className="text-gray-400 mt-1">Smart stock control & analytics</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 w-64 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none"
          />

          <button className="px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 font-semibold">
            + Add Product
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          ["Products", totalProducts, "📦"],
          ["Total Units", totalUnits, "📊"],
          ["Low Stock", lowStock, "⚠️"],
          ["Out Stock", outStock, "❌"],
          ["Value", `₹${stockValueTotal}`, "💰"],
        ].map((item, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <p className="text-sm text-gray-400">
              {item[2]} {item[0]}
            </p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {item[1]}
            </h2>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10"
        >
          <option value="ALL">All Stock</option>
          <option value="GOOD">In Stock</option>
          <option value="LOW">Low Stock</option>
          <option value="OUT">Out Stock</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10"
        >
          <option value="DEFAULT">Default</option>
          <option value="LOWEST">Lowest Qty</option>
          <option value="HIGHEST">Highest Qty</option>
          <option value="PRICE">Highest Price</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
        <div className="grid grid-cols-12 px-5 py-4 border-b border-white/10 text-gray-400 text-sm font-semibold">
          <div className="col-span-3">Product</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Stock</div>
          <div className="col-span-2">Health</div>
          <div className="col-span-3">Actions</div>
        </div>

        {loading ? (
          <p className="p-5 text-gray-400">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-5 text-gray-400">No Products Found</p>
        ) : (
          filteredProducts.map((p, i) => {
            const badge = getStatus(p.quantity);

            return (
              <div
                key={p.id}
                className={`grid grid-cols-12 px-5 py-4 items-center border-b border-white/5 hover:bg-white/5 transition ${
                  i % 2 === 0 ? "bg-white/[0.01]" : ""
                }`}
              >
                <div className="col-span-3 font-semibold">{p.name}</div>

                <div className="col-span-2">₹{p.price}</div>

                <div className="col-span-2">
                  <p className="font-bold">{p.quantity}</p>

                  <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden w-24">
                    <div
                      className="h-full bg-green-400"
                      style={{
                        width: `${Math.min(p.quantity, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                </div>

                <div className="col-span-3 flex gap-2">
                  <button
                    onClick={() => quickAddStock(p.id, p.quantity)}
                    className="px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-sm font-semibold"
                  >
                    +10
                  </button>

                  <button
                    onClick={() => openEditModal(p)}
                    className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-white/10 p-6">
            <h2 className="text-xl font-bold text-green-400">Update Stock</h2>

            <p className="text-gray-400 mt-1">{selected.name}</p>

            <input
              type="number"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              className="mt-5 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none"
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={saveStock}
                className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
