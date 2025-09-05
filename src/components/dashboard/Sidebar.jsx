import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    {
      id: 1,
      name: "Summary",
      icon: "📊",
      path: "/Dashboard",
    },
    {
      id: 2,
      name: "Projects",
      icon: "📁",
      path: "/Dashboard/overview",
    },
  ];

  return (
<aside className="bg-white text-gray-800 border-r border-gray-200 h-full shadow-lg hidden sm:block">
  <nav className="p-2 sm:p-4">
    <ul className="space-y-1 sm:space-y-2">
      {navItems.map((item) => (
        <li key={item.id}>
          <Link
            to={item.path}
            className="flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 group hover:shadow-sm"
          >
            <span className="mr-2 sm:mr-3 text-lg sm:text-xl text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
              {item.icon}
            </span>
            <span className="font-medium group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">
              {item.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
</aside>


  );
};

export default Sidebar;
