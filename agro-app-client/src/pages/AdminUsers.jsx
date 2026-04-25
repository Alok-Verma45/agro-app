import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminUsers() {

  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [roleModal, setRoleModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [profileModal, setProfileModal] = useState(null);

  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("token");

  const API = "http://localhost:8080/api/admin/users";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ======================================
  // FETCH USERS
  // ======================================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ======================================
  // FILTER
  // ======================================
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // ======================================
  // STATS
  // ======================================
  const totalUsers = users.length;
  const totalAdmins = users.filter(
    (u) => u.role === "ADMIN"
  ).length;
  const totalCustomers = users.filter(
    (u) => u.role === "USER"
  ).length;

  // ======================================
  // HELPERS
  // ======================================
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

  // ======================================
  // PROFILE
  // ======================================
  const openProfile = async (id) => {
    try {
      const res = await axios.get(
        `${API}/${id}`,
        { headers }
      );

      setProfileModal(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================================
  // CHANGE ROLE
  // ======================================
  const confirmRoleChange = async () => {
    try {
      setProcessingId(roleModal.id);

      await axios.put(
        `${API}/${roleModal.id}/role`,
        null,
        {
          params: {
            role: roleModal.role,
          },
          headers,
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === roleModal.id
            ? { ...u, role: roleModal.role }
            : u
        )
      );

      setRoleModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================
  // BLOCK / UNBLOCK
  // ======================================
  const toggleBlock = async (user) => {
    try {
      setProcessingId(user.id);

      await axios.put(
        `${API}/${user.id}/block`,
        null,
        { headers }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                blocked: !u.blocked,
              }
            : u
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================
  // DELETE USER
  // ======================================
  const confirmDelete = async () => {
    try {
      setProcessingId(deleteModal.id);

      await axios.delete(
        `${API}/${deleteModal.id}`,
        { headers }
      );

      setUsers((prev) =>
        prev.filter(
          (u) => u.id !== deleteModal.id
        )
      );

      setDeleteModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
        <h1 className="text-3xl font-bold">
          👥 Admin Users
        </h1>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="px-4 py-3 rounded-xl bg-gray-900 border border-white/10 outline-none w-full lg:w-96"
        />
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-7">
        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400 text-sm">
            👥 Total Users
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {totalUsers}
          </h2>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400 text-sm">
            🛡️ Admins
          </p>
          <h2 className="text-4xl font-bold mt-2 text-purple-400">
            {totalAdmins}
          </h2>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400 text-sm">
            🛒 Customers
          </p>
          <h2 className="text-4xl font-bold mt-2 text-green-400">
            {totalCustomers}
          </h2>
        </div>
      </div>

      {/* USERS */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-gray-900 rounded-2xl p-5 border border-white/5"
          >
            <div className="grid lg:grid-cols-3 gap-5 items-center">
              {/* LEFT */}
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center font-bold">
                  {initials(user.name)}
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    {user.name}
                  </h2>

                  <p className="text-gray-300">
                    {user.email}
                  </p>

                  <p className="text-sm text-gray-400">
                    📞 {user.phone || "No phone"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Joined: {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              {/* CENTER */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 p-3 rounded-xl">
                  <p className="text-xs text-gray-400">
                    Orders
                  </p>
                  <h3 className="font-bold">
                    {user.totalOrders || 0}
                  </h3>
                </div>

                <div className="bg-gray-800 p-3 rounded-xl">
                  <p className="text-xs text-gray-400">
                    Spent
                  </p>
                  <h3 className="font-bold">
                    ₹{user.totalSpent || 0}
                  </h3>
                </div>

                <div className="bg-gray-800 p-3 rounded-xl">
                  <p className="text-xs text-gray-400">
                    Role
                  </p>
                  <h3 className="font-bold">
                    {user.role}
                  </h3>
                </div>

                <div className="bg-gray-800 p-3 rounded-xl">
                  <p className="text-xs text-gray-400">
                    Status
                  </p>
                  <h3
                    className={`font-bold ${
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
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  onClick={() =>
                    navigate(`/admin/users/${user.id}`)
                  }
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Profile
                </button>

                <button
                  onClick={() =>
                    setRoleModal({
                      id: user.id,
                      role:
                        user.role === "ADMIN"
                          ? "USER"
                          : "ADMIN",
                      name: user.name,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700"
                >
                  Change Role
                </button>

                <button
                  disabled={
                    processingId === user.id
                  }
                  onClick={() =>
                    toggleBlock(user)
                  }
                  className={`px-4 py-2 rounded-xl ${
                    user.blocked
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {user.blocked
                    ? "Unblock"
                    : "Block"}
                </button>

                <button
                  onClick={() =>
                    setDeleteModal({
                      id: user.id,
                      name: user.name,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PROFILE MODAL */}
      {profileModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              👤 User Profile
            </h2>

            <div className="space-y-2 text-gray-300">
              <p>Name: {profileModal.name}</p>
              <p>Email: {profileModal.email}</p>
              <p>Phone: {profileModal.phone}</p>
              <p>Role: {profileModal.role}</p>
              <p>
                Joined:{" "}
                {formatDate(
                  profileModal.createdAt
                )}
              </p>
              <p>
                Orders:{" "}
                {profileModal.totalOrders}
              </p>
              <p>
                Total Spent: ₹
                {profileModal.totalSpent}
              </p>
            </div>

            <button
              onClick={() =>
                setProfileModal(null)
              }
              className="mt-5 px-4 py-2 bg-gray-700 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ROLE MODAL */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-3">
              Change Role
            </h2>

            <p className="text-gray-300 mb-5">
              Change{" "}
              <b>{roleModal.name}</b> to{" "}
              <b>{roleModal.role}</b> ?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setRoleModal(null)
                }
                className="px-4 py-2 bg-gray-700 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 bg-green-600 rounded-xl"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-400 mb-3">
              Delete User
            </h2>

            <p className="text-gray-300 mb-5">
              Delete{" "}
              <b>{deleteModal.name}</b> ?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteModal(null)
                }
                className="px-4 py-2 bg-gray-700 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;