import React from 'react';

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-soft hover:shadow-soft-md',
  secondary: 'bg-white text-surface-700 border border-surface-200 hover:border-surface-300 hover:shadow-soft',
  outline: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50',
  ghost: 'bg-transparent text-surface-600 hover:bg-surface-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const Button = ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
