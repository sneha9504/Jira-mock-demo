import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome To Jira Dashboard
        </h1>
        <nav className="flex items-center space-x-4">
          {/* Username */}
          <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            {JSON.parse(localStorage.getItem("user"))?.username}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
