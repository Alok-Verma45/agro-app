import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();

      setProducts(res.data);
    } catch {
      showToast("❌ Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => setToast(""), 2000);
  };

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id, 1);
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("🛒 Added to cart");
    } catch {
      showToast("❌ Add to cart failed");
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://via.placeholder.com/400x300?text=No+Image";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
  };

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category === "All" || p.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div className="py-8 px-4 md:px-8 space-y-6 text-gray-900 dark:text-white">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🌾 Products</h1>

        <p className="text-gray-600 dark:text-gray-400">
          Premium farming essentials for every season.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            p-4 rounded-xl outline-none
            bg-white dark:bg-white/5
            border border-gray-300 dark:border-white/10
            text-gray-900 dark:text-white
            placeholder:text-gray-500 dark:placeholder:text-gray-400
          "
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
            p-4 rounded-xl outline-none
            bg-white dark:bg-white/5
            border border-gray-300 dark:border-white/10
            text-gray-900 dark:text-white
          "
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-black">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="
                rounded-2xl overflow-hidden transition
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/5
                hover:-translate-y-1 hover:shadow-xl
              "
            >
              <img
                src={getImageUrl(p.imageUrl)}
                alt={p.name}
                className="w-full h-52 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />

              <div className="p-4 space-y-3">
                <div>
                  <h2 className="font-bold text-lg line-clamp-1">{p.name}</h2>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {p.category}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-500 dark:text-green-400">
                    ₹{p.price}
                  </span>

                  {p.quantity > 0 ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 dark:text-green-400">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-500 dark:text-red-400">
                      Out
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/product/${p.id}`}
                    className="text-center px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleAddToCart(p.id)}
                    disabled={p.quantity === 0}
                    className="px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white"
                  >
                    Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Products;
