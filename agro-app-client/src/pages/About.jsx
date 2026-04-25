function About() {
  return (
    <div className="min-h-screen px-4 py-6 md:py-10 bg-gradient-to-b from-slate-50 via-white to-green-50 dark:from-[#020617] dark:via-slate-950 dark:to-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <section
          className="
          relative overflow-hidden rounded-[28px] md:rounded-[36px]
          border border-white/60 dark:border-white/10
          bg-white/80 dark:bg-slate-900/70
          backdrop-blur-xl
          shadow-xl shadow-green-100/60 dark:shadow-none
          px-5 sm:px-8 md:px-12
          py-12 sm:py-16 md:py-24
        "
        >
          {/* effects */}
          <div className="absolute -top-10 -left-10 w-40 h-40 md:w-72 md:h-72 bg-green-400/20 dark:bg-green-500/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 md:w-72 md:h-72 bg-lime-300/20 dark:bg-lime-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10 max-w-4xl">
            <span
              className="
              inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-semibold
              bg-green-100 text-green-700
              dark:bg-green-500/15 dark:text-green-300
              border border-green-200 dark:border-green-500/20
            "
            >
              🌱 India’s Smart Agriculture Platform
            </span>

            <h1 className="mt-5 text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
              About{" "}
              <span className="text-green-600 dark:text-green-400">
                Agro App
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg md:text-xl leading-7 sm:leading-8 text-gray-600 dark:text-gray-300 max-w-3xl">
              Agro App is a modern agriculture marketplace helping farmers buy
              seeds, fertilizers, pesticides and farming tools with trust,
              transparency and doorstep delivery.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="px-5 py-3 rounded-2xl bg-green-600 text-white font-semibold shadow-lg">
                Trusted by Farmers
              </div>

              <div className="px-5 py-3 rounded-2xl border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5">
                Fast Delivery Across India
              </div>
            </div>
          </div>
        </section>

        {/* MISSION + VISION */}
        <section className="grid lg:grid-cols-2 gap-6 mt-6 md:mt-8">

          <div className="rounded-[26px] border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 p-6 md:p-8 shadow-lg dark:shadow-none">
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Our Mission
            </h2>
            <div className="w-16 h-1 bg-green-500 rounded-full my-5"></div>

            <p className="text-gray-600 dark:text-gray-300 leading-8">
              Empower farmers with genuine products, affordable pricing,
              digital convenience and faster delivery. We remove traditional
              buying hassles and simplify agriculture commerce.
            </p>
          </div>

          <div className="rounded-[26px] border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 p-6 md:p-8 shadow-lg dark:shadow-none">
            <div className="text-4xl mb-3">🌍</div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Our Vision
            </h2>
            <div className="w-16 h-1 bg-green-500 rounded-full my-5"></div>

            <p className="text-gray-600 dark:text-gray-300 leading-8">
              Become India’s most trusted digital farming ecosystem where
              technology increases productivity, profitability and farmer
              growth nationwide.
            </p>
          </div>

        </section>

        {/* FEATURES */}
        <section className="mt-6 md:mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 md:mb-6">
            Why Farmers Choose Us
          </h2>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {[
              ["🌱", "Quality Products", "Only verified agriculture essentials."],
              ["🚚", "Fast Delivery", "Quick & safe doorstep shipping."],
              ["💰", "Best Prices", "Fair pricing with offers."],
              ["📞", "Support Team", "Help whenever needed."],
            ].map((item, i) => (
              <div
                key={i}
                className="
                rounded-3xl p-6
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-slate-900/80
                shadow-md hover:shadow-xl
                dark:shadow-none
                hover:-translate-y-1
                transition duration-300
              "
              >
                <div className="text-4xl mb-4">{item[0]}</div>

                <h3 className="text-xl font-semibold mb-2">
                  {item[1]}
                </h3>

                <p className="text-gray-500 dark:text-gray-400">
                  {item[2]}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* STATS */}
        <section
          className="
          mt-6 md:mt-8 rounded-[26px]
          border border-gray-200 dark:border-white/10
          bg-white/90 dark:bg-slate-900/80
          p-6 md:p-8 shadow-xl dark:shadow-none
        "
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

            {[
              ["500+", "Products"],
              ["10K+", "Happy Farmers"],
              ["24/7", "Support"],
              ["100%", "Trusted"],
            ].map((item, i) => (
              <div key={i}>
                <h3 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
                  {item[0]}
                </h3>

                <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
                  {item[1]}
                </p>
              </div>
            ))}

          </div>
        </section>

      </div>
    </div>
  );
}

export default About;