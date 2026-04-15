function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4
    bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">

      <h1 className="text-4xl font-bold text-green-500 mb-4">
        Welcome 👋
      </h1>

      <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-6">
        Welcome to Agro App. Your account is ready 🚀
      </p>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <p className="text-gray-700 dark:text-gray-300">
          This is your home page. More features coming soon...
        </p>
      </div>

    </div>
  );
}

export default Home;