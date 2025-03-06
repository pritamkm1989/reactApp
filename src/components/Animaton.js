import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import image1 from "../img/home-1.jpg";
import image2 from "../img/home2.jpg";
import image3 from "../img/home3.jpg";
import image4 from "../img/home4.jpg";
const images = [
  image1,
  image2,
  image3,
  image4
];

const ImageBox = () => {
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlippedIndex((prevIndex) => (prevIndex === null ? 0 : (prevIndex + 1) % images.length));
    }, 2000); // Flip every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {images.map((imageUrl, index) => (
        <motion.div
          key={index}
          className="w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-2xl shadow-lg cursor-pointer relative"
          animate={{ rotateY: flippedIndex === index ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ perspective: 1000 }}
        >
          <div className="absolute w-full h-full backface-hidden">
            <img src={imageUrl} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
          </div>
          
        </motion.div>
      ))}
    </div>
  );
};

export default ImageBox;
