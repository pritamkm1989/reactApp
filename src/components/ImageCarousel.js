// src/components/ImageCarousel.js
import React, { useState, useEffect } from 'react';


import image1 from "../img/img-1.jpg";
import image2 from "../img/img-2.jpg";
import image3 from "../img/img-3.png";

const ImageCarousel = () => {
  const images = [image1, image2, image3]; // Using imported images

  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Auto carousel functionality with useEffect
  useEffect(() => {
    // Set an interval to automatically change the image every 3 seconds (3000ms)
    const interval = setInterval(nextImage, 3000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Image Carousel Container */}
      <div className="overflow-hidden rounded-lg">
        <div className="relative w-full h-64">
          {/* Background Image */}
          <img
            src={images[currentIndex]} // The image is accessed through the imported variable
            alt={`carousel-image-${currentIndex}`}
            className="w-full h-full object-fill"
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevImage}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
      >
        &#60;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
      >
        &#62;
      </button>
    </div>
  );
};

export default ImageCarousel;