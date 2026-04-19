function Home() {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center 
      text-center px-4 sm:px-6 overflow-hidden
      bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800
      transition-all duration-500"
    >

      {/* 🌟 BACKGROUND */}
      <div className="absolute w-52 sm:w-72 h-52 sm:h-72 
      bg-green-500/20 rounded-full blur-3xl top-10 sm:top-20 left-5 sm:left-20"></div>

      <div className="absolute w-52 sm:w-72 h-52 sm:h-72 
      bg-green-400/10 rounded-full blur-3xl bottom-10 sm:bottom-20 right-5 sm:right-20"></div>

      {/* 🔥 TITLE */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">

        <span className="bg-gradient-to-r from-green-400 to-emerald-500 
        bg-clip-text text-transparent">
          आपका डिजिटल कृषि साथी 🌱
        </span>

        <span className="block text-sm sm:text-lg md:text-xl 
        text-gray-500 dark:text-gray-300 mt-3 font-medium">
          (Your Smart Farming Partner)
        </span>
      </h1>

      {/* SUBTITLE */}
      <p className="text-gray-600 dark:text-gray-300 
      text-sm sm:text-base md:text-lg max-w-md sm:max-w-xl mb-8 leading-relaxed">
        उन्नतशील बीज भंडार में आपका स्वागत है 🚀  
        <br />
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          आपका खाता सफलतापूर्वक तैयार हो चुका है।
        </span>
      </p>

      {/* 🎯 SIMPLE GLASS CARD */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl 
      p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-white/20
      max-w-md sm:max-w-lg">

        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          🌱 यह प्लेटफ़ॉर्म किसानों और व्यापारियों के लिए बनाया गया है।  
          <br /><br />
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            This platform helps you manage your farming business easily.
          </span>
        </p>
      </div>

      {/* 🌾 ICONS */}
      <div className="mt-10 flex gap-6 text-2xl sm:text-3xl">
        {["🌾", "🚜", "🌱"].map((icon, i) => (
          <span
            key={i}
            className="hover:scale-125 transition cursor-pointer"
          >
            {icon}
          </span>
        ))}
      </div>

      {/* 🚀 FUTURE CTA (optional placeholder) */}
      <div className="mt-8 text-gray-400 text-sm">
        🚀 जल्द ही नए फीचर्स जोड़े जाएंगे...
      </div>
    </div>
  );
}

export default Home;