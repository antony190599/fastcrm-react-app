import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  actionButton = null,
  backLink = null
}) => {
  return (
    <div className="mb-6">
      {backLink && (
        <Link 
          to={backLink.to} 
          className="inline-flex items-center text-sm text-blue-600 mb-4 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {backLink.text || 'Back'}
        </Link>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {actionButton && actionButton}
      </div>
    </div>
  );
};

export default PageHeader;
