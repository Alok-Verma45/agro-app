function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden
    bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800
    transition-all duration-500">

      {/* 🌟 BACKGROUND GLOW */}
      <div className="absolute w-72 h-72 bg-green-500/20 rounded-full blur-3xl top-20 left-20"></div>
      <div className="absolute w-72 h-72 bg-green-400/10 rounded-full blur-3xl bottom-20 right-20"></div>

      {/* 🔥 TITLE */}
      <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 leading-tight">
        आपका डिजिटल कृषि <br /> प्रबंधन साथी 🌱
      </h1>

      {/* SUBTITLE */}
      <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mb-8">
        उन्नतशील बीज भंडार में आपका स्वागत है।  
        आपका खाता सफलतापूर्वक तैयार हो चुका है 🚀
      </p>

      {/* 🎯 GLASS CARD */}
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg 
        p-6 rounded-2xl shadow-xl border border-white/20
        hover:scale-105 transition duration-300 max-w-lg">

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          यहाँ से आप अपने ग्राहकों, उत्पादों और उधारी को आसानी से मैनेज कर सकते हैं।
          <br /> नए फीचर्स जल्द ही जोड़े जाएंगे...
        </p>
      </div>

      {/* 🔥 ICONS */}
      <div className="mt-10 flex gap-6 text-3xl">
        <span className="hover:scale-125 transition cursor-pointer">🌾</span>
        <span className="hover:scale-125 transition cursor-pointer">🚜</span>
        <span className="hover:scale-125 transition cursor-pointer">📦</span>
        <span className="hover:scale-125 transition cursor-pointer">💰</span>
      </div>

      {/* 🚀 CTA */}
      <div className="mt-8">
        <button className="bg-green-500 hover:bg-green-600 
          text-white px-8 py-3 rounded-xl font-semibold
          shadow-lg hover:shadow-green-500/30
          hover:scale-105 active:scale-95 
          transition cursor-pointer">
          फीचर्स देखें →
        </button>
      </div>
    </div>
  );
}

export default Home;