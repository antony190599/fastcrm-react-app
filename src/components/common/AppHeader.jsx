import React from 'react';
import { Link } from 'react-router-dom';

const AppHeader = ({ 
  title, 
  actionLinks = [],
  breadcrumbs = []
}) => {
  return (
    <div className="mb-4 md:mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex mb-2 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="inline-flex items-center whitespace-nowrap">
                {index > 0 && (
                  <span className="mx-1 md:mx-2 text-gray-400">/</span>
                )}
                {item.href ? (
                  <Link 
                    to={item.href} 
                    className="text-xs md:text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-xs md:text-sm font-medium text-gray-500">
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 md:mb-0 space-y-3 sm:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold text-center sm:text-left">{title}</h1>
        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {actionLinks.map((action, index) => (
            action.onClick ? (
              // Render as button when onClick is provided
              <button
                key={index}
                onClick={action.onClick}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-sm rounded whitespace-nowrap ${action.className || 'bg-blue-600 hover:bg-blue-700 text-white'}`}
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
                className={`px-3 py-1.5 md:px-4 md:py-2 text-sm rounded whitespace-nowrap ${action.className || 'bg-blue-600 hover:bg-blue-700 text-white'}`}
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