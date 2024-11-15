import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from '../shared/Sidebar';
import Header from '../shared/Header';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      {/* Fixed header */}
        {/* Show burger icon button only on mobile */}

      {/* Main content container */}
      <div className="flex flex-row flex-1 pt-16 dark:bg-gray-800">
         <Header toggleSidebar={toggleSidebar} />
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Sidebar */}

        {/* Main content area */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto h-screen">
          <div className="max-w-[120rem] my-0 mx-auto flex flex-col gap-8 h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for closing sidebar on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 xl:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;
