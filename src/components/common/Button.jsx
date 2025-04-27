import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded font-medium transition-colors";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };
  
  const sizeClasses = {
    sm: "text-sm px-2.5 py-1.5",
    md: "text-sm px-4 py-2", 
    lg: "text-base px-6 py-3"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;