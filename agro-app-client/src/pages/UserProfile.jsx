import { useEffect, useState } from "react";
import { userApi } from "../api/userApi";

function UserProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(false);

  // ======================
  // FETCH PROFILE
  // ======================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile(); // ✅ FIXED
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ======================
  // SAVE PROFILE
  // ======================
  const handleSave = async () => {
    try {
      setLoading(true);
      await userApi.updateProfile(user); // ✅ FIXED
      setLoading(false);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 p-4 sm:p-8">

      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* PROFILE CARD */}
        <div className="
          bg-white dark:bg-slate-900
          border border-gray-200 dark:border-white/10
          rounded-2xl p-6 shadow-md
          flex flex-col sm:flex-row items-center gap-6
        ">

          {/* AVATAR */}
          <div className="
            w-20 h-20 rounded-full
            bg-green-600 text-white
            flex items-center justify-center
            text-3xl font-bold
          ">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          {/* USER INFO */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user.name || "User"}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user.email || "email@example.com"}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Member since {user.createdAt?.substring(0, 10) || "-"}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-center">
            <p className="text-lg font-bold text-green-600">12</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-center">
            <p className="text-lg font-bold text-green-600">Active</p>
            <p className="text-xs text-gray-500">Status</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-center">
            <p className="text-lg font-bold text-green-600">India</p>
            <p className="text-xs text-gray-500">Region</p>
          </div>

        </div>

        {/* EDIT FORM */}
        <div className="
          bg-white dark:bg-slate-900
          border border-gray-200 dark:border-white/10
          rounded-2xl p-6 shadow-md
        ">

          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Edit Profile
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Name
              </label>
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                className="
                  w-full mt-1 px-3 py-2 rounded-xl
                  bg-white dark:bg-slate-800
                  border border-gray-300 dark:border-white/10
                  text-gray-800 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Phone
              </label>
              <input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="
                  w-full mt-1 px-3 py-2 rounded-xl
                  bg-white dark:bg-slate-800
                  border border-gray-300 dark:border-white/10
                  text-gray-800 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500
                "
              />
            </div>

            {/* EMAIL */}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Email
              </label>
              <input
                value={user.email}
                disabled
                className="
                  w-full mt-1 px-3 py-2 rounded-xl
                  bg-gray-100 dark:bg-slate-800
                  border border-gray-300 dark:border-white/10
                  text-gray-500 dark:text-gray-400
                "
              />
            </div>

          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="
              mt-6 w-full py-2 rounded-xl
              bg-green-600 hover:bg-green-700
              text-white font-medium
              transition-all duration-200
              hover:scale-[1.02]
            "
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default UserProfile;