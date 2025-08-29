import React from 'react';

export interface LoaderProps {
  size?: number;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  const defaultClasses = 'animate-spin text-white';
  const combinedClasses = className ? `${defaultClasses} ${className}` : defaultClasses;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={combinedClasses}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default Loader;
