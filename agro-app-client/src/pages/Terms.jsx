function Terms() {
  return (
    <div className="min-h-screen px-4 py-6 md:py-10 bg-gradient-to-b from-slate-50 via-white to-green-50 dark:from-[#020617] dark:via-slate-950 dark:to-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <section
          className="
          relative overflow-hidden rounded-[24px] md:rounded-[32px]
          border border-gray-200 dark:border-white/10
          bg-white dark:bg-gradient-to-br dark:from-green-900/30 dark:via-slate-900 dark:to-black
          shadow-xl dark:shadow-none
          px-5 sm:px-8 md:px-12
          py-12 sm:py-16 md:py-20
        "
        >
          <div className="absolute top-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-green-400/20 dark:bg-green-500/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-lime-300/20 dark:bg-lime-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10 max-w-4xl">
            <span className="inline-block px-4 sm:px-5 py-2 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-400/20 text-xs sm:text-sm font-medium">
              📜 Rules & Guidelines
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Terms &{" "}
              <span className="text-green-600 dark:text-green-500">
                Conditions
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-7 md:leading-8 max-w-3xl">
              Please read these terms carefully before using Agro App.
              By accessing our platform, you agree to follow these rules.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="grid md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              🛒 Orders & Products
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              <li>• Products are subject to stock availability.</li>
              <li>• Product images are for reference only.</li>
              <li>• Prices may change without prior notice.</li>
              <li>• Orders may be cancelled if stock is unavailable.</li>
            </ul>
          </div>

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              🚚 Delivery Rules
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              <li>• Customers must provide correct address details.</li>
              <li>• Delivery timelines may vary by location.</li>
              <li>• Delays due to weather/logistics may occur.</li>
              <li>• Failed delivery attempts may require reprocessing.</li>
            </ul>
          </div>

        </section>

        {/* ACCOUNT */}
        <section className="grid md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              👤 User Responsibilities
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              <li>• Keep login credentials secure.</li>
              <li>• Use the platform lawfully.</li>
              <li>• Fake orders are strictly prohibited.</li>
              <li>• Misuse may lead to account restriction.</li>
            </ul>
          </div>

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              ⚖️ General Terms
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              <li>• Policies may be updated anytime.</li>
              <li>• Continued use means acceptance of updates.</li>
              <li>• Agro App reserves operational rights.</li>
              <li>• Disputes subject to applicable laws.</li>
            </ul>
          </div>

        </section>

        {/* FOOT NOTE */}
        <section className="mt-6 md:mt-8 rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-500">
            ✅ Agreement Notice
          </h3>

          <p className="mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-7 md:leading-8">
            By using Agro App, creating an account or placing an order,
            you acknowledge and agree to these Terms & Conditions.
          </p>
        </section>

      </div>
    </div>
  );
}

export default Terms;