import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
          error ? 'border-error focus:ring-error/30 focus:border-error' : 'border-surface-200 hover:border-surface-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-surface-700 mb-1.5">
        {label}
      </label>
    )}
    <textarea
      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 placeholder:text-surface-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
        error ? 'border-error focus:ring-error/30 focus:border-error' : 'border-surface-200 hover:border-surface-300'
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-error">{error}</p>}
  </div>
);

const Select = ({ label, error, children, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-surface-700 mb-1.5">
        {label}
      </label>
    )}
    <select
      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
        error ? 'border-error focus:ring-error/30 focus:border-error' : 'border-surface-200 hover:border-surface-300'
      } ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-error">{error}</p>}
  </div>
);

export { Input, Textarea, Select };
export default Input;
