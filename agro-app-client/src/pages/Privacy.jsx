function Privacy() {
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
              🔒 Your Data Matters
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Privacy <span className="text-green-600 dark:text-green-500">Policy</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-7 md:leading-8 max-w-3xl">
              Agro App values your privacy and is committed to protecting your
              personal information with transparency and security.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="grid md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              📋 Information We Collect
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              <li>• Name, phone number and email address</li>
              <li>• Delivery address and order details</li>
              <li>• Account login related basic data</li>
              <li>• Support inquiries and communication data</li>
            </ul>
          </div>

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              🎯 Why We Use It
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              <li>• Process orders smoothly</li>
              <li>• Deliver products to your location</li>
              <li>• Provide customer support</li>
              <li>• Improve user experience and services</li>
            </ul>
          </div>

        </section>

        {/* SECURITY */}
        <section className="grid md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              🛡️ Data Security
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <p className="text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              We use secure systems and best practices to protect your
              information from unauthorized access, misuse or loss.
            </p>
          </div>

          <div className="rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              🤝 Third Parties
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <p className="text-gray-700 dark:text-gray-300 leading-7 md:leading-8 text-sm sm:text-base">
              We do not sell your personal data. Limited information may be
              shared only with delivery or payment partners when required.
            </p>
          </div>

        </section>

        {/* FOOT NOTE */}
        <section className="mt-6 md:mt-8 rounded-[24px] md:rounded-[28px] border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-xl dark:shadow-none p-5 sm:p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-500">
            ✅ Your Trust Is Our Priority
          </h3>

          <p className="mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-7 md:leading-8">
            By using Agro App, you agree to this Privacy Policy. We may update
            this policy occasionally to improve transparency and compliance.
          </p>
        </section>

      </div>
    </div>
  );
}

export default Privacy;