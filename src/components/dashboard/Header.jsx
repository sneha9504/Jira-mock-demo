import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/img/jira.jpeg'
import useNotificationStore from "../../store/notificationStore";

const Header = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotificationStore();
  const handleLogout = () => {

    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      showNotification("Logged out successfully!", "success");
      navigate("/", { replace: true });
    }
  };

  return (
  <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 shadow-md">
  <div className="flex items-center justify-between flex-wrap gap-4">
    <div className="flex items-center gap-3 sm:gap-4">
      <img
        src={logo}
        alt="Logo"
        className="w-10 h-10 sm:w-12 sm:h-12 p-2 transition-all duration-300 hover:scale-105"
      />
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Welcome To Jira Dashboard
      </h1>
    </div>

    <nav className="flex items-center space-x-3 sm:space-x-4">
      {/* Username */}
      <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer">
        {JSON.parse(localStorage.getItem("user"))?.username}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        Logout
      </button>
    </nav>
  </div>
</header>



  );
};

export default Header;
