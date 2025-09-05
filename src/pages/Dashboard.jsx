import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/dashboard/Header";
import Main from "../components/dashboard/Main";
import Sidebar from "../components/dashboard/Sidebar";
import Footer from "../components/dashboard/Footer";

const Dashboard = () => {
  return (
<section className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
  <Header />
  <div className="flex-1 flex overflow-hidden">
    <aside className="hidden md:block w-48 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg overflow-y-auto">
      <Sidebar />
    </aside>
    <main className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
      <Main />
    </main>
  </div>
  <Footer />
</section>


  );
};

export default Dashboard;
