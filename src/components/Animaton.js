import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import image1 from "../img/home-1.jpg";
import image2 from "../img/home2.jpg";
import image3 from "../img/home3.jpg";
import image4 from "../img/home4.jpg";

const images = [image1, image2, image3, image4];

const ImageBox = () => {
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlippedIndex(prev => (prev === null ? 0 : (prev + 1) % images.length));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((url, i) => (
        <motion.div
          key={i}
          className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-soft-md"
          animate={{ rotateY: flippedIndex === i ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ perspective: 1000 }}
        >
          <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute inset-0 backface-hidden bg-primary-500 flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-white text-3xl font-bold">UrbEx</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageBox;
