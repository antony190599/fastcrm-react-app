import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  error = null,
  name,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-gray-800 placeholder-gray-400`}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;