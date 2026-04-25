import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AdminUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const API = `http://localhost:8080/api/admin/users/${id}`;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(API, { headers });
      setUser(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const initials = (name) =>
    name
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
        <p>User not found</p>

        <button
          onClick={() => navigate("/admin/users")}
          className="px-5 py-2 rounded-xl bg-blue-600"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-6">
      {/* HEADER */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          👤 User Profile
        </h1>

        <button
          onClick={() => navigate("/admin/users")}
          className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700"
        >
          ← Back
        </button>
      </div>

      {/* TOP CARD */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-white/5 mb-6">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          {/* LEFT */}
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold">
              {initials(user.name)}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="text-gray-300">
                {user.email}
              </p>

              <p className="text-gray-400 text-sm">
                📞 {user.phone || "No phone"}
              </p>
            </div>
          </div>

          {/* CENTER */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Role
              </p>
              <h3 className="font-bold mt-1">
                {user.role}
              </h3>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Status
              </p>
              <h3
                className={`font-bold mt-1 ${
                  user.blocked
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {user.blocked
                  ? "Blocked"
                  : "Active"}
              </h3>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Joined
              </p>
              <h3 className="font-bold mt-1">
                {formatDate(user.createdAt)}
              </h3>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Last Login
              </p>
              <h3 className="font-bold mt-1">
                {formatDate(user.lastLogin)}
              </h3>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Orders
              </p>
              <h3 className="text-xl font-bold mt-1">
                {user.totalOrders || 0}
              </h3>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-xs text-gray-400">
                Total Spent
              </p>
              <h3 className="text-xl font-bold mt-1 text-green-400">
                ₹{user.totalSpent || 0}
              </h3>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl col-span-2">
              <p className="text-xs text-gray-400">
                Address
              </p>
              <h3 className="font-medium mt-1">
                {user.address ||
                  "No address available"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* EXTRA SECTION */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">
            Wallet Balance
          </p>
          <h2 className="text-3xl font-bold mt-2">
            ₹{user.wallet || 0}
          </h2>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">
            Coupons Used
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {user.couponsUsed || 0}
          </h2>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">
            Cancelled Orders
          </p>
          <h2 className="text-3xl font-bold mt-2 text-red-400">
            {user.cancelledOrders || 0}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default AdminUserProfile;