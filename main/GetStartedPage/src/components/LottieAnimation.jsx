import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/Animation.json';

export default function LottieAnimation({ style, large }) {
  const size = large ? 420 : 320;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', ...style }}>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: size, height: size, filter: 'drop-shadow(0 0 24px #7c3aed) brightness(1.1) saturate(1.2) hue-rotate(-10deg)' }}
      />
    </div>
  );
} 