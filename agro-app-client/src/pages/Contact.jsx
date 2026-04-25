import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("success");
          setLoading(false);
          formRef.current.reset();
        },
        () => {
          setStatus("error");
          setLoading(false);
        }
      );
  };

  return (
    <section className="px-4 py-6 md:py-10 min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50 dark:from-[#020617] dark:via-slate-950 dark:to-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div
          className="
          relative overflow-hidden rounded-[24px] md:rounded-[32px]
          border border-gray-200 dark:border-white/10
          bg-white dark:bg-gradient-to-br dark:from-green-900/30 dark:via-slate-900 dark:to-black
          shadow-xl dark:shadow-none
          mb-6 md:mb-8
        "
        >
          {/* Background */}
          <div
            className="absolute inset-0 opacity-10 dark:opacity-30 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')",
            }}
          ></div>

          <div className="absolute inset-0 bg-white/80 dark:bg-black/45"></div>

          {/* Floating Icons */}
          <div className="hidden xl:block absolute top-14 left-16 text-5xl opacity-60">🎧</div>
          <div className="hidden xl:block absolute top-28 left-72 text-5xl opacity-60">🚚</div>
          <div className="hidden xl:block absolute top-20 right-24 text-5xl opacity-60">🌿</div>
          <div className="hidden xl:block absolute top-28 right-72 text-5xl opacity-60">✉️</div>

          <div className="relative z-10 text-center px-5 sm:px-8 md:px-10 py-12 sm:py-16 md:py-20">
            <span
              className="
              inline-block px-4 sm:px-5 py-2 rounded-full
              bg-green-100 dark:bg-green-500/20
              text-green-700 dark:text-green-300
              border border-green-300 dark:border-green-400/20
              text-xs sm:text-sm font-medium
            "
            >
              🌱 We are here to help
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Contact{" "}
              <span className="text-green-600 dark:text-green-500">
                Agro App
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-7">
              Reach us for product support, orders, delivery help and business
              inquiries.
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* LEFT */}
          <div
            className="
            rounded-[24px] md:rounded-[28px]
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-slate-900/80
            p-5 sm:p-6 md:p-8
            shadow-xl dark:shadow-none
          "
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              🌱 Get In Touch
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <p className="text-gray-700 dark:text-gray-300 leading-8 mb-8 text-sm sm:text-base md:text-lg">
              Trusted platform for seeds, fertilizers, pesticides and farming
              tools. Helping farmers with genuine products and easy delivery.
            </p>

            <div className="space-y-5 text-sm sm:text-base md:text-lg">
              <div className="flex gap-4 items-start">
                <span className="text-2xl shrink-0">📞</span>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Phone
                  </p>
                  <p>+91 9628586190</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-2xl shrink-0">📧</span>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Email
                  </p>
                  <p className="break-all sm:break-normal">
                    support@agroapp.in
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-2xl shrink-0">📍</span>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Address
                  </p>
                  <p>Lucknow, Uttar Pradesh, India</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-2xl shrink-0">⏰</span>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Working Hours
                  </p>
                  <p>Mon - Sat : 9 AM to 7 PM</p>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div className="mt-8 h-56 sm:h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
              <iframe
                title="Agro App Location"
                src="https://www.google.com/maps?q=Lucknow,India&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
            rounded-[24px] md:rounded-[28px]
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-slate-900/80
            p-5 sm:p-6 md:p-8
            shadow-xl dark:shadow-none
          "
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              📨 Send Us a Message
            </h2>

            <div className="w-16 h-1 bg-green-500 rounded-full mb-6"></div>

            <div className="mb-6 p-4 rounded-2xl bg-green-100 dark:bg-green-500/15 border border-green-300 dark:border-green-500/20 text-green-700 dark:text-green-300 text-sm sm:text-base">
              ✅ We usually reply within a few minutes.
            </div>

            {status === "success" && (
              <div className="mb-4 p-4 rounded-2xl bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-300">
                Message sent successfully.
              </div>
            )}

            {status === "error" && (
              <div className="mb-4 p-4 rounded-2xl bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-300">
                Failed to send message.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-white/10 outline-none focus:border-green-500"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-white/10 outline-none focus:border-green-500"
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Your Subject"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-white/10 outline-none focus:border-green-500"
              />

              <textarea
                name="message"
                rows="6"
                placeholder="Your Message"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-white/10 outline-none focus:border-green-500 resize-none"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-lime-500 hover:scale-[1.01] transition font-bold text-base md:text-lg text-white disabled:opacity-60"
              >
                {loading ? "Sending..." : "🚀 Send Message"}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                🔒 Your information is secure and will not be shared.
              </p>
            </form>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div
          className="
          mt-6 md:mt-8 rounded-[24px] md:rounded-[28px]
          border border-gray-200 dark:border-white/10
          bg-white dark:bg-slate-900/80
          grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6
          p-5 md:p-6 text-center
          shadow-xl dark:shadow-none
        "
        >
          <div>
            <div className="text-3xl mb-2">✅</div>
            <p className="font-semibold">100% Trusted</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Genuine products only
            </p>
          </div>

          <div>
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-semibold">Fast Delivery</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quick & safe delivery
            </p>
          </div>

          <div>
            <div className="text-3xl mb-2">🎧</div>
            <p className="font-semibold">24/7 Support</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We are always here
            </p>
          </div>

          <div>
            <div className="text-3xl mb-2">🌿</div>
            <p className="font-semibold">For Farmers</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dedicated to farmers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;