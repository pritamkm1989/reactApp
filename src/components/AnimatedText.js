import React, { useState, useEffect } from 'react';


const AnimatedTypingText = () => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "A few words about the company\nA Study of Creativity\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.";

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
      <h6>A few words about the company</h6>
      <h3>A Study of Creativity</h3>
      <p>{displayedText}</p>
    </div>
  );
};

export default AnimatedTypingText;
