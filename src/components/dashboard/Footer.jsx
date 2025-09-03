import React from "react";

const Footer = () => {
  return (
   <footer className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-4 mt-auto border-t border-gray-200 dark:border-gray-700">
  <div className="max-w-7xl mx-auto px-3 flex flex-col items-center justify-center gap-6 text-center">
    {/* Brand & copyright */}
    <p className="text-sm font-medium">
      © {new Date().getFullYear()}{" "}
      <span className="font-semibold text-blue-600 dark:text-blue-400">
        Kanban&nbsp;Board&nbsp;by&nbsp;Sneha&nbsp;Wani
      </span>. All rights reserved.
    </p>

    
  </div>
</footer>

  );
};

export default Footer;
