import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg className={`animate-spin text-primary-500 ${sizes[size]} ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
};

const LoadingOverlay = ({ loading, children }) => {
  if (!loading) return children;
  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl">
        <Spinner size="lg" />
      </div>
      <div className="opacity-30 pointer-events-none">{children}</div>
    </div>
  );
};

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <Spinner size="lg" />
  </div>
);

export { Spinner, LoadingOverlay, PageLoader };
export default Spinner;
