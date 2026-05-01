import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {

    const navigate = useNavigate(); 
  return (
    <section
      className="
        relative overflow-hidden
        rounded-3xl
        px-6 py-6 md:px-10 md:py-8 mb-6
        text-white
        bg-gradient-to-r
        from-green-600 via-emerald-700 to-teal-800
      "
    >
      {/* overlay depth */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative grid md:grid-cols-2 gap-6 items-center">
        {/* LEFT */}
        <div className="max-w-lg">
          {/* small tag */}
          <p className="text-xs tracking-widest text-green-200 mb-2">
            SMART AGRICULTURE PLATFORM
          </p>

          {/* FIXED HEADING (single flow, no break) */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              text-2xl md:text-4xl
              font-bold leading-tight
            "
          >
            🌱 आपका डिजिटल{" "}
            <span className="text-green-300 font-extrabold">कृषि साथी</span>
          </motion.h1>

          {/* subtext */}
          <p className="mt-3 text-sm md:text-base text-green-100">
            Smart farming solutions designed to boost productivity and simplify
            agriculture.
          </p>

          {/* buttons */}
          <div className="mt-5 flex gap-3 flex-wrap">
            {/* PRIMARY CTA */}
            <button
              onClick={() => navigate("/products")}
              className="
      px-6 py-3 rounded-xl
      bg-white text-green-700 font-semibold
      hover:scale-105 transition
    "
            >
              Start Shopping →
            </button>

            {/* SECONDARY CTA */}
            <button
              onClick={() => navigate("/advice")}
              className="
      px-6 py-3 rounded-xl
      border border-white/40
      hover:bg-white/10 transition
    "
            >
              🌱 Get Crop Advice
            </button>
          </div>
        </div>

        {/* RIGHT  */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex justify-center items-center"
        >
          <div className="relative w-[280px] h-[230px]">
            {/* GLOW BACKGROUND */}
            <div className="absolute inset-0 bg-green-400/10 blur-3xl rounded-full" />

            {/* BACK CARD */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="
        absolute top-12 left-12
        w-44 h-44
        rounded-2xl
        bg-white/5 border border-white/10
        backdrop-blur-md
      "
            />

            {/* MAIN CARD */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="
        absolute top-4 left-6
        w-48 h-48
        rounded-2xl
        bg-white/10 backdrop-blur-xl
        border border-white/20
        flex flex-col items-center justify-center
        shadow-2xl
      "
            >
              <span className="text-5xl">🌾</span>
              <p className="text-sm text-green-100 mt-2">Crop Growth</p>
            </motion.div>

            {/* BASE SHADOW (important realism) */}
            <div
              className="
      absolute bottom-3 left-1/2 -translate-x-1/2
      w-32 h-6 bg-black/30 blur-xl rounded-full
    "
            />

            {/* BADGES (clean distribution) */}

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="
        absolute top-2 left-10
        text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur
      "
            >
              🌱 Seeds
            </motion.div>

            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="
        absolute top-20 right-0
        text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur
      "
            >
              🧪 Fertilizer
            </motion.div>

            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="
        absolute bottom-4 right-12
        text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur
      "
            >
              🚚 Delivery
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
