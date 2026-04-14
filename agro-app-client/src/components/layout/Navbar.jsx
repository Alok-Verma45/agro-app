import { useEffect, useState } from "react";

function Navbar({ toggleSidebar }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <div className="sticky top-0 z-50 
      bg-gray-900 text-white 
      border-b border-gray-700 
      shadow-sm px-6 py-3 flex justify-between items-center">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        
        <h1 className="text-xl font-bold text-green-400">
          Agro App 🌱
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <button className="text-gray-300 hover:text-white">
          Login
        </button>

        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
          Signup
        </button>

        <button
          onClick={toggleSidebar}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          ☰
        </button>
      </div>
    </div>
  );
}

export default Navbar;