import React from 'react';

const Card = ({ children, className = '', hover = true, padding = true, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-surface-200 ${padding ? 'p-5' : ''} ${hover ? 'hover:shadow-soft-md hover:border-surface-300 transition-all duration-200' : 'shadow-soft'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardImage = ({ src, alt, className = '' }) => (
  <div className={`relative overflow-hidden -mx-5 -mt-5 mb-4 rounded-t-2xl ${className}`}>
    <img src={src} alt={alt} className="w-full h-44 object-cover" />
  </div>
);

Card.Image = CardImage;
export default Card;
