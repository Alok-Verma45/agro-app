import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/sections/Hero";
import { getProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================
  // IMAGE URL
  // =====================================
  const getImageUrl = (path) => {
    if (!path) {
      return "https://via.placeholder.com/400x300?text=No+Image";
    }

    if (path.startsWith("http")) {
      return path;
    }

    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  // =====================================
  // ADD TO CART
  // =====================================
  const handleAddToCart = async (productId) => {
    try {
      if (!token || role !== "USER") {
        alert("Please login as user");
        return;
      }

      await addToCart(productId, 1);

      window.dispatchEvent(new Event("cartUpdated"));

      alert("Added to cart");
    } catch (error) {
      console.error(error);
      alert("Failed to add cart");
    }
  };

  // =====================================
  // FILTER
  // =====================================
  const filteredProducts = products.filter((p) => {
    const matchSearch = (p.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || (p.category || "") === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div
      className="
      min-h-screen
      bg-gray-100 dark:bg-slate-950
      text-gray-900 dark:text-white
      transition-colors duration-300
    "
    >
      <div className="w-full px-3 sm:px-5 lg:px-6 py-6">
        {/* HERO */}
        <Hero />

        {/* SEARCH */}
        <section className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            w-full px-5 py-4 rounded-2xl
            bg-white dark:bg-slate-900
            border border-gray-300 dark:border-white/10
            text-gray-900 dark:text-white
            outline-none
          "
          />
        </section>

        {/* CATEGORIES */}
        <section className="flex flex-wrap gap-3 mb-10">
          {["All", "Seeds", "Fertilizer", "Pesticides", "Tools", "Offers"].map(
            (item, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(item)}
                className={`px-5 py-2 rounded-full border transition ${
                  selectedCategory === item
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white dark:bg-slate-900 border-gray-300 dark:border-white/10 text-gray-800 dark:text-white hover:border-green-500 hover:text-green-500"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </section>

        {/* PRODUCTS */}
        <section id="products" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} Products
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
  <div
    key={product.id}
    className="
      group
      bg-white dark:bg-slate-900
      border border-gray-200 dark:border-white/10
      rounded-2xl overflow-hidden
      transition-all duration-300
      hover:shadow-xl hover:-translate-y-1
    "
  >
    {/* IMAGE */}
    <div className="relative h-44 bg-gray-100 dark:bg-slate-800 overflow-hidden">
      <img
        src={getImageUrl(product.imageUrl)}
        alt={product.name}
        className="
          w-full h-full object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x300?text=No+Image";
        }}
      />

      {/* TOP BADGE */}
      <div className="absolute top-3 left-3">
        <span
          className="
            px-2.5 py-1 rounded-full text-[11px] font-medium
            bg-white/80 dark:bg-black/40 backdrop-blur
            text-gray-800 dark:text-white
            border border-white/20
          "
        >
          {product.category || "General"}
        </span>
      </div>

      {/* STOCK BADGE */}
      <div className="absolute top-3 right-3">
        <span
          className={`
            px-2.5 py-1 rounded-full text-[11px] font-medium
            backdrop-blur border
            ${
              product.quantity > 0
                ? "bg-green-500/20 text-green-600 border-green-400/30"
                : "bg-red-500/20 text-red-500 border-red-400/30"
            }
          `}
        >
          {product.quantity > 0 ? "In Stock" : "Out"}
        </span>
      </div>
    </div>

    {/* CONTENT */}
    <div className="p-4">
      {/* NAME */}
      <h3 className="font-semibold text-base line-clamp-1">
        {product.name}
      </h3>

      {/* DESC */}
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[32px]">
        {product.description || "High quality agriculture product."}
      </p>

      {/* PRICE + STOCK */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xl font-bold text-green-600">
          ₹{product.price}
        </p>

        <p className="text-[11px] text-gray-500">
          Qty: {product.quantity}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Link
          to={`/product/${product.id}`}
          className="
            text-center py-2 rounded-lg text-sm
            bg-gray-100 dark:bg-white/10
            hover:bg-gray-200 dark:hover:bg-white/20
            transition
          "
        >
          Details
        </Link>

        <button
          onClick={() => handleAddToCart(product.id)}
          disabled={product.quantity === 0}
          className={`
            py-2 rounded-lg text-sm font-medium text-white
            transition
            ${
              product.quantity > 0
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          Add
        </button>
      </div>
    </div>
  </div>
))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found
            </div>
          )}
        </section>

        {/* WHY CHOOSE */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Quick and safe product delivery.",
              },
              {
                icon: "✅",
                title: "Genuine Products",
                desc: "Trusted agriculture products only.",
              },
              {
                icon: "📞",
                title: "Support",
                desc: "Help available whenever needed.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="
                bg-white dark:bg-slate-900
                border border-gray-200 dark:border-white/5
                rounded-2xl p-6
              "
              >
                <div className="text-3xl mb-3">{item.icon}</div>

                <h3 className="font-semibold text-lg">{item.title}</h3>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Farmer Trust</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              `"Quality seeds received on time. Very good service."`,
              `"Products are genuine and useful for crops."`,
            ].map((msg, i) => (
              <div
                key={i}
                className="
                bg-white dark:bg-slate-900
                border border-gray-200 dark:border-white/5
                rounded-2xl p-6
              "
              >
                <p className="italic text-gray-700 dark:text-gray-300">{msg}</p>

                <p className="mt-4 text-green-500">
                  {i === 0 ? "- Farmer, Fatehpur" : "- Farmer, Mahmundabad"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="
  border-t border-gray-300 dark:border-white/10
  pt-6
  text-sm
  text-gray-600 dark:text-gray-400
  flex flex-col md:flex-row gap-4
  md:items-center md:justify-between
"
        >
          {/* LEFT */}
          <div className="space-y-1">
            <p>© 2026 Agro App. All rights reserved.</p>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              Designed & Developed with{" "}
              <span className="text-pink-500">💗</span> by{" "}
              <span className="text-green-600 dark:text-green-400 font-medium">
                Alok Verma
              </span>
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="hover:text-green-500 transition">
              About
            </Link>

            <Link to="/contact" className="hover:text-green-500 transition">
              Contact
            </Link>

            <Link to="/privacy" className="hover:text-green-500 transition">
              Privacy
            </Link>

            <Link to="/terms" className="hover:text-green-500 transition">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
