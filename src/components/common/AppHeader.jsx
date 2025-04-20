import React from 'react';
import { Link } from 'react-router-dom';

const AppHeader = ({ 
  title, 
  actionLinks = [],
  breadcrumbs = []
}) => {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex mb-2" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
                {item.href ? (
                  <Link 
                    to={item.href} 
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-gray-500">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      {/* Title and Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        <div className="flex space-x-2">
          {actionLinks.map((action, index) => (
            action.onClick ? (
              // Render as button when onClick is provided
              <button
                key={index}
                onClick={action.onClick}
                className={`px-4 py-2 rounded ${action.className || 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {action.icon && (
                  <span className="mr-1">{action.icon}</span>
                )}
                {action.label}
              </button>
            ) : (
              // Render as Link when only href is provided
              <Link
                key={index}
                to={action.href}
                className={`px-4 py-2 rounded ${action.className || 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {action.icon && (
                  <span className="mr-1">{action.icon}</span>
                )}
                {action.label}
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
