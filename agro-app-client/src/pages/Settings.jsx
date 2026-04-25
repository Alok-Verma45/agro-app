function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-400">
        ⚙️ Settings
      </h1>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div>
          <p className="text-sm text-gray-400">
            Store Name
          </p>
          <input
            className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10"
            defaultValue="Agro App Store"
          />
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Contact Email
          </p>
          <input
            className="mt-2 w-full p-3 rounded-xl bg-white/5 border border-white/10"
            defaultValue="admin@agroapp.com"
          />
        </div>

        <button className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;