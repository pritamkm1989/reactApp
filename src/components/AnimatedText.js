import React, { useState, useEffect } from 'react';


const AnimatedTypingText = () => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "At Urbex, we specialize in expert service and repair for a wide range of products and appliances, ensuring quality and reliability. Our skilled technicians are dedicated to providing fast, efficient, and customer-focused solutions.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        index = 0;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-typing-text animated-typing-text-container">
      <p>{displayedText}</p>
    </div>
  );
};

export default AnimatedTypingText;
