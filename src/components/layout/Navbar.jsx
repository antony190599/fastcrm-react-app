import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ isOpen, onClose }) => {
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0
      transition-transform duration-300 ease-in-out
      w-[240px] md:w-[180px] 
      min-h-screen bg-gray-50 border-r border-gray-200 
      fixed left-0 top-0 bottom-0 
      z-20 shadow-lg md:shadow-none
    `}>
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="text-xl font-semibold text-gray-800">FastCRM</Link>
      </div>
      
      <nav className="py-6 flex flex-col">
        <NavLink 
          to="/dashboard" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${
              isActive 
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/templates" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${
              isActive 
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Templates
        </NavLink>
        
        <NavLink 
          to="/contacts" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${
              isActive 
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Contacts
        </NavLink>
        
        <NavLink 
          to="/contact-logs" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${
              isActive 
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Historial
        </NavLink>
        
        <NavLink 
          to="/companies" 
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${
              isActive 
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Companies
        </NavLink>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 mr-2 flex items-center justify-center text-white text-xs">
            UN
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">User</span>
            <span className="text-xs text-gray-500">user@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;