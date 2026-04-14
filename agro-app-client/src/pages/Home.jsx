import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center h-[80vh] text-center px-4
      bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
    >
      {/* Title */}
      <h1 className="text-4xl font-bold text-green-500 mb-4 animate-pulse">
        Agro App 🌱
      </h1>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-6">
        Manage your customers, products, and udhar (credits) easily in one place.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">

        {/* Primary */}
        <Link
          to="/dashboard"
          className="bg-green-500 hover:bg-green-600 
          text-white px-6 py-3 rounded-xl 
          text-lg shadow-lg transition font-semibold hover:scale-105"
        >
          Go to Dashboard →
        </Link>

        {/* Secondary */}
        <Link
          to="/products"
          className="px-5 py-3 rounded-xl 
          bg-white dark:bg-gray-800 
          text-gray-800 dark:text-white
          hover:bg-gray-200 dark:hover:bg-gray-700 
          transition shadow hover:scale-105"
        >
          📦 Products
        </Link>

        <Link
          to="/customers"
          className="px-5 py-3 rounded-xl 
          bg-white dark:bg-gray-800 
          text-gray-800 dark:text-white
          hover:bg-gray-200 dark:hover:bg-gray-700 
          transition shadow hover:scale-105"
        >
          👥 Customers
        </Link>

        <Link
          to="/credits"
          className="px-5 py-3 rounded-xl 
          bg-white dark:bg-gray-800 
          text-gray-800 dark:text-white
          hover:bg-gray-200 dark:hover:bg-gray-700 
          transition shadow hover:scale-105"
        >
          💰 Credits
        </Link>

      </div>
    </div>
  );
}

export default Home;