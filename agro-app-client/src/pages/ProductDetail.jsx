import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProducts();
      const found = res.data.find((p) => p.id === Number(id));
      setProduct(found);
    } catch (err) {
      console.error("❌ Product fetch error:", err);
    }
  };

  // 🛒 ADD TO CART (FINAL)
  const handleAddToCart = async () => {
    if (!product || loading) return;

    try {
      setLoading(true);

      await addToCart(product.id, 1);

      // 🔥 refresh product (optional but correct)
      await fetchProduct();

      // 🔥 navbar sync
      window.dispatchEvent(new Event("cartUpdated"));

      setToast("✅ Added to cart");
    } catch (err) {
      console.error("❌ Add error:", err);

      if (err.response?.status === 401) {
        setToast("⚠️ Please login first");
        navigate("/login");
      } else {
        setToast("❌ Failed to add");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setToast(""), 2000);
    }
  };

  // 📦 STOCK STATUS
  const getStockStatus = () => {
    if (!product) return {};

    if (product.quantity === 0) {
      return {
        text: "Out of Stock (स्टॉक खत्म)",
        color: "text-red-400 bg-red-500/10",
      };
    }

    if (product.quantity <= 5) {
      return {
        text: `Low Stock (${product.quantity} left)`,
        color: "text-yellow-400 bg-yellow-500/10",
      };
    }

    return {
      text: "In Stock (उपलब्ध)",
      color: "text-green-400 bg-green-500/10",
    };
  };

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading...
      </div>
    );
  }

  const stock = getStockStatus();

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 text-white">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-sm text-gray-400 hover:text-green-400 transition"
      >
        ← Go Back
      </button>

      {/* MAIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">

        {/* IMAGE */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 
        border border-white/10 rounded-2xl 
        flex items-center justify-center 
        h-64 sm:h-80 text-6xl shadow-lg">
          📦
        </div>

        {/* DETAILS */}
        <div className="bg-white/5 backdrop-blur-xl 
        border border-white/10 
        p-6 rounded-2xl shadow-xl">

          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            {product.name}
          </h1>

          <p className="text-green-400 text-2xl font-bold mb-4">
            ₹{product.price}
          </p>

          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-5 ${stock.color}`}
          >
            {stock.text}
          </span>

          <p className="text-gray-400 text-sm mb-6">
            यह उत्पाद कृषि उपयोग के लिए उपयुक्त है।
            <br />
            This product is suitable for farming and daily agricultural needs.
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0 || loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              product.quantity > 0
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading
              ? "Adding..."
              : product.quantity > 0
              ? "Add to Cart 🛒"
              : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* 🔔 TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 
        bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default ProductDetail;