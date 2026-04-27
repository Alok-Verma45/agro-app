import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

import {
  getProductById,
  getProducts,
} from "../api/productApi";

import { addToCart } from "../api/cartApi";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [qty, setQty] =
    useState(1);

  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const res =
        await getProductById(id);

      setProduct(res.data);

      const all =
        await getProducts();

      const related =
        all.data
          .filter(
            (p) =>
              p.id !==
              Number(id)
          )
          .slice(0, 4);

      setRelatedProducts(
        related
      );
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
  if (!path) {
    return "https://via.placeholder.com/600x600?text=No+Image";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
};

  // =========================
  // QTY
  // =========================
  const increaseQty = () => {
    if (
      product &&
      qty <
        product.quantity
    ) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart =
    async () => {
      try {
        if (
          !token ||
          role !== "USER"
        ) {
          alert(
            "Please login as user"
          );
          navigate(
            "/login"
          );
          return;
        }

        await addToCart(
          product.id,
          qty
        );

        window.dispatchEvent(
          new Event(
            "cartUpdated"
          )
        );

        alert(
          "Added to cart"
        );
      } catch (error) {
        console.error(
          error
        );
        alert(
          "Failed to add cart"
        );
      }
    };

  // =========================
  // BUY NOW
  // =========================
  const handleBuyNow =
    async () => {
      await handleAddToCart();
      navigate("/cart");
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Product not found
      </div>
    );
  }

  const inStock =
    product.quantity >
    0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* BACK */}
        <button
          onClick={() =>
            navigate(-1)
          }
          className="mb-6 text-gray-400 hover:text-white"
        >
          ← Go Back
        </button>

        {/* TOP SECTION */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* IMAGE */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8">

            <img
              src={getImageUrl(
                product.imageUrl
              )}
              alt={
                product.name
              }
              className="h-[420px] w-full rounded-2xl object-cover"
              onError={(
                e
              ) => {
                e.target.src =
                  "https://via.placeholder.com/600x600?text=No+Image";
              }}
            />

            <div className="grid grid-cols-4 gap-3 mt-4">

              {[1, 2, 3, 4].map(
                (
                  item
                ) => (
                  <img
                    key={
                      item
                    }
                    src={getImageUrl(
                      product.imageUrl
                    )}
                    alt="thumb"
                    className="h-20 w-full rounded-xl object-cover border border-white/10"
                  />
                )
              )}

            </div>

          </div>

          {/* DETAILS */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8">

            <p className="text-sm text-green-400 mb-2">
              Premium Agriculture Product
            </p>

            <h1 className="text-4xl font-bold">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-yellow-400">
                ⭐⭐⭐⭐⭐
              </span>

              <span className="text-gray-400 text-sm">
                4.8 Farmer Rating
              </span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <h2 className="text-4xl font-bold text-green-400">
                ₹
                {
                  product.price
                }
              </h2>

              <span className="text-gray-500 line-through">
                ₹
                {Math.round(
                  product.price *
                    1.15
                )}
              </span>

              <span className="text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded-lg">
                15% OFF
              </span>
            </div>

            <div className="mt-4">
              {inStock ? (
                <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm">
                  In Stock (
                  {
                    product.quantity
                  }{" "}
                  available)
                </span>
              ) : (
                <span className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="mt-6 text-gray-300 leading-7">
              {product.description ||
                "High quality farming product designed for better crop growth, stronger roots and improved harvest output."}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-800 rounded-2xl p-4">
                🚚 Free Delivery above ₹999
              </div>

              <div className="bg-slate-800 rounded-2xl p-4">
                🔒 Secure Checkout
              </div>

              <div className="bg-slate-800 rounded-2xl p-4">
                🔁 Easy Returns
              </div>

              <div className="bg-slate-800 rounded-2xl p-4">
                📞 Support Available
              </div>
            </div>

            {/* QTY */}
            <div className="mt-8">
              <p className="mb-3 text-sm text-gray-400">
                Quantity
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={
                    decreaseQty
                  }
                  className="w-12 h-12 rounded-xl bg-slate-800 text-xl"
                >
                  -
                </button>

                <div className="w-16 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold">
                  {qty}
                </div>

                <button
                  onClick={
                    increaseQty
                  }
                  className="w-12 h-12 rounded-xl bg-slate-800 text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <button
                disabled={
                  !inStock
                }
                onClick={
                  handleAddToCart
                }
                className="py-4 rounded-2xl bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50"
              >
                Add to Cart 🛒
              </button>

              <button
                disabled={
                  !inStock
                }
                onClick={
                  handleBuyNow
                }
                className="py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                Buy Now ⚡
              </button>
            </div>

          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="grid lg:grid-cols-3 gap-6 mt-10">

          <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-5">
              Product Details
            </h2>

            <div className="space-y-4 text-gray-300">
              <p>
                ✔ Improves crop performance
              </p>
              <p>
                ✔ Trusted quality material
              </p>
              <p>
                ✔ Suitable for modern farming
              </p>
              <p>
                ✔ Easy to use and reliable
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-5">
              Delivery Info
            </h2>

            <div className="space-y-4 text-gray-300">
              <p>
                📦 Delivery in 2-5 days
              </p>
              <p>
                💵 Cash on Delivery
              </p>
              <p>
                🔒 Safe Packaging
              </p>
              <p>
                📍 Pan India Available
              </p>
            </div>
          </div>

        </div>

        {/* RELATED */}
        <section className="mt-12">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Related Products
            </h2>

            <Link
              to="/home"
              className="text-green-400"
            >
              View All
            </Link>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {relatedProducts.map(
              (
                item
              ) => (
                <Link
                  key={
                    item.id
                  }
                  to={`/product/${item.id}`}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-5 hover:border-green-500/40 transition"
                >

                  <img
                    src={getImageUrl(
                      item.imageUrl
                    )}
                    alt={
                      item.name
                    }
                    className="h-32 w-full rounded-xl object-cover"
                    onError={(
                      e
                    ) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />

                  <h3 className="mt-4 font-semibold text-lg">
                    {
                      item.name
                    }
                  </h3>

                  <p className="text-green-400 font-bold mt-2">
                    ₹
                    {
                      item.price
                    }
                  </p>

                </Link>
              )
            )}

          </div>

        </section>

      </div>
    </div>
  );
}

export default ProductDetail;