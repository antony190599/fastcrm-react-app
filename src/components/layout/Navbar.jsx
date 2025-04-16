import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-xl font-bold">FASTCRM</Link>
          
          <div className="space-x-6">
            <NavLink 
              to="/contacts" 
              className={({ isActive }) => 
                isActive 
                  ? "border-b-2 border-blue-400 pb-1" 
                  : "hover:text-gray-300"
              }
            >
              Contactos
            </NavLink>
            <NavLink 
              to="/companies" 
              className={({ isActive }) => 
                isActive 
                  ? "border-b-2 border-blue-400 pb-1" 
                  : "hover:text-gray-300"
              }
            >
              Empresas
            </NavLink>
            <NavLink 
              to="/templates" 
              className={({ isActive }) => 
                isActive 
                  ? "border-b-2 border-blue-400 pb-1" 
                  : "hover:text-gray-300"
              }
            >
              Plantillas
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;