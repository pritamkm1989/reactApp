import React, { useState } from 'react';
import { FiImage } from 'react-icons/fi';

const Img = ({ src, alt, className = '' }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500 ${className}`}>
        <FiImage size={20} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default Img;
