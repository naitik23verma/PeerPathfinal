import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 40, className = '' }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayed}</span>;
};

export default TypewriterText; 