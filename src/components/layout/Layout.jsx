import React, { useState } from 'react';
import Navbar from './Navbar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Navbar/Sidebar */}
      <Navbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="md:ml-[180px] w-full overflow-y-auto bg-gray-50">
        {/* Mobile header with app name */}
        <div className="md:hidden bg-white p-4 shadow-sm flex justify-center">
          <span className="text-xl font-semibold text-gray-800">FastCRM</span>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;