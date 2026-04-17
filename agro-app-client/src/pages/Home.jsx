function Home() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4
      bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800
      transition-all duration-500"
    >
      {/* 🔥 Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-green-500 mb-4 animate-bounce">
        Welcome 👋
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-8">
        Welcome to Agro App. Your account is ready 🚀
      </p>

      {/* 🎯 Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl 
        hover:scale-105 transition duration-300">

        <p className="text-gray-700 dark:text-gray-300">
          This is your home page. More features coming soon...
        </p>
      </div>

      {/* 🔥 Floating Elements */}
      <div className="mt-10 flex gap-6 text-2xl animate-pulse">
        <span>🌾</span>
        <span>🚜</span>
        <span>📦</span>
        <span>💰</span>
      </div>

      {/* 🎯 CTA (optional future use) */}
      <div className="mt-8">
        <button
          className="bg-green-500 hover:bg-green-600 
          text-white px-6 py-2 rounded-lg 
          shadow-md hover:scale-105 active:scale-95 
          transition cursor-pointer"
        >
          Explore Features →
        </button>
      </div>
    </div>
  );
}

export default Home;