import { useEffect, useState } from "react";
import {
  getCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
} from "../api/customerApi";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCustomer = async () => {
    if (!form.name || !form.phone) {
      alert("Name and Phone required");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateCustomer(editingId, form);
        setToast("Customer updated");
      } else {
        await addCustomer(form);
        setToast("Customer added");
      }

      setForm({ name: "", phone: "", address: "" });
      setEditingId(null);
      setShowForm(false);
      fetchCustomers();

      setTimeout(() => setToast(""), 2000);
    } catch (error) {
      console.error(error);
      setToast("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await deleteCustomer(id);
      fetchCustomers();

      setToast("Customer deleted");
      setTimeout(() => setToast(""), 2000);
    } catch (error) {
      console.error(error);
      setToast("Delete failed");
    }
  };

  const handleEditCustomer = (c) => {
    setForm({
      name: c.name,
      phone: c.phone,
      address: c.address,
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  return (
    <div className="p-6">
      <input
        type="text"
        placeholder="Search by name or phone..."
        className="border p-2 rounded mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setForm({ name: "", phone: "", address: "" });
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Customer
          </button>
        </div>

        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-600 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((c) => (
              <tr
                key={c.id}
                className="bg-white shadow-sm hover:shadow-md transition rounded-lg"
              >
                <td className="p-3 rounded-l-lg font-medium">{c.name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3 text-gray-600">{c.address}</td>

                <td className="p-3 rounded-r-lg flex gap-2">
                  <button
                    onClick={() => handleEditCustomer(c)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCustomer(c.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Customer" : "Add Customer"}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-400"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-400"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                className="border p-2 rounded focus:ring-2 focus:ring-green-400"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddCustomer}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Customers;
