import React, { useEffect, useRef, useState } from "react";
import { FiStar } from "react-icons/fi";

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
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex gap-0.5 text-primary-500">
      {[...Array(full)].map((_, i) => <FiStar key={`f${i}`} className="fill-primary-500" size={14} />)}
      {half && (
        <span className="relative">
          <FiStar size={14} className="text-surface-200" />
          <span className="absolute inset-0 overflow-hidden w-1/2"><FiStar className="fill-primary-500" size={14} /></span>
        </span>
      )}
      {[...Array(empty)].map((_, i) => <FiStar key={`e${i}`} size={14} className="text-surface-200" />)}
    </div>
  );
};

const Testimonials = () => {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const [isTouching, setIsTouching] = useState(false);

  const autoScroll = () => {
    if (sliderRef.current && !isTouching) {
      sliderRef.current.scrollLeft += 1;
      if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth / 2) {
        sliderRef.current.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(autoScroll);
    }
  };

  useEffect(() => {
    if (!isTouching) animationRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isTouching, autoScroll]);

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-2">Real feedback from real people</p>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto hide-scrollbar pb-2"
          onMouseEnter={() => setIsTouching(true)}
          onMouseLeave={() => setIsTouching(false)}
          onTouchStart={() => setIsTouching(true)}
          onTouchEnd={() => setIsTouching(false)}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 min-w-[280px] w-[280px] shrink-0 border border-surface-100 shadow-soft hover:shadow-soft-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-semibold text-surface-900">{t.name}</h3>
                  <StarRating rating={t.rating} />
                </div>
              </div>
              <p className="text-sm text-surface-600 leading-relaxed">"{t.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
