import React from 'react';

const variants = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-surface-100 text-surface-500 border-surface-200',
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
};

const Badge = ({ children, variant = 'primary', className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
