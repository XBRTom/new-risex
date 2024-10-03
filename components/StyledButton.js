import React from 'react';

const StyledButton = ({ onClick, children, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default StyledButton;
