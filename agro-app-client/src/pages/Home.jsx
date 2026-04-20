import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  // 🔍 FILTER
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 space-y-6">

      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-green-400">
          🌱 आपका डिजिटल कृषि साथी
        </h1>

        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          उपलब्ध उत्पाद देखें (Explore Products)
        </p>
      </div>

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

      {/* 📦 PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">
            🚫 कोई उत्पाद नहीं मिला
          </p>
          <p className="text-sm text-gray-500">
            (No products found)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white/5 backdrop-blur-xl 
              border border-white/10 
              p-4 rounded-xl shadow-lg 
              hover:scale-[1.03] transition flex flex-col justify-between"
            >
              {/* 📦 NAME */}
              <h2 className="text-lg font-semibold mb-2">
                {p.name}
              </h2>

              {/* 📊 INFO */}
              <p className="text-gray-400 text-sm">
                मात्रा: {p.quantity}
              </p>

              <p className="text-green-400 font-bold text-lg mt-2">
                ₹{p.price}
              </p>

              {/* 🚀 BUTTON */}
              <button
                onClick={() => navigate(`/product/${p.id}`)}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 
                text-white py-2 rounded-lg transition"
              >
                View Details
              </button>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Home;