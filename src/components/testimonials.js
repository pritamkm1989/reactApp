import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    review: "Great service! My AC was fixed in no time. Highly recommend.",
    rating: 4.5,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    review: "Very professional staff. My washing machine is working like new!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Alex Johnson",
    review: "Affordable pricing and excellent support. Will use again.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} />
      ))}
      {hasHalfStar && <FaStarHalfAlt />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <FaRegStar key={i} />
      ))}
    </div>
  );
};

const Testimonials = () => {
  const sliderRef = useRef(null);
  const [isTouching, setIsTouching] = useState(false);
  const [scrollAmount, setScrollAmount] = useState(0);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // Auto-scroll function
  const autoScroll = () => {
    if (sliderRef.current && !isTouching) {
      setScrollAmount((prevScroll) => {
        let newScroll = prevScroll + 1;
        if (newScroll >= sliderRef.current.scrollWidth / 2) {
          newScroll = 0;
        }
        sliderRef.current.scrollLeft = newScroll;
        return newScroll;
      });
    }
    if (!isTouching) {
      requestAnimationFrame(autoScroll); // Continue auto-scrolling
    }
  };

  useEffect(() => {
    if (!isTouching) {
      const interval = requestAnimationFrame(autoScroll); // Start auto-scrolling when component mounts
      return () => cancelAnimationFrame(interval); // Clean up when component unmounts
    }
  }, [isTouching]);

  // Handle touch start and end for pausing auto-scrolling
  const handleTouchStart = () => setIsTouching(true);
  const handleTouchEnd = () => setIsTouching(false);
  const handleTouchCancel = () => setIsTouching(false);

  // Handle mouse enter and leave for pausing auto-scrolling on desktop
  const handleMouseEnter = () => setIsTouching(true);
  const handleMouseLeave = () => setIsTouching(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">What Our Customers Say</h2>
      <div
        className="flex gap-6 overflow-hidden"
        ref={sliderRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 w-64 min-w-[16rem] flex-shrink-0"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-16 h-16 rounded-full mx-auto"
            />
            <h3 className="text-lg font-semibold text-center mt-2">{testimonial.name}</h3>
            <p className="text-gray-600 text-sm text-center mt-1">{testimonial.review}</p>
            <div className="flex justify-center mt-2">
              <StarRating rating={testimonial.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
