import React, { useState, useEffect } from 'react';
import './LoadingPage.css';

const featureList = [
  { icon: '🧑‍🏫', label: 'Mentorship' },
  { icon: '🤝', label: 'Collaboration' },
  { icon: '📚', label: 'Resources' },
];

const loadingMessages = [
  'Loading PeerPath...',
  'Connecting students...',
  'Building your experience...',
  'Almost there...'
];

const LoadingPage = () => {
  const [messageIdx, setMessageIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [progress, setProgress] = useState(0);

  // Typewriter effect for loading messages
  useEffect(() => {
    let timeout;
    if (typed.length < loadingMessages[messageIdx].length) {
      timeout = setTimeout(() => {
        setTyped(loadingMessages[messageIdx].slice(0, typed.length + 1));
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setTyped('');
        setMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 900);
    }
    return () => clearTimeout(timeout);
  }, [typed, messageIdx]);

  // Circular progress animation
  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 18);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-modern-bg">
      <div className="loading-modern-center">
        <div className="loading-modern-card">
          <img src="/peerpath.png" alt="PeerPath" className="loading-modern-logo" />
          <h1 className="loading-modern-title">PeerPath</h1>
          <p className="loading-modern-subtitle">
            Where students connect, collaborate, and grow together
          </p>
          <div className="loading-modern-progress">
            <svg className="progress-ring" width="80" height="80">
              <circle
                className="progress-ring-bg"
                cx="40" cy="40" r="34" fill="none" stroke="#2e1065" strokeWidth="8" />
              <circle
                className="progress-ring-bar"
                cx="40" cy="40" r="34" fill="none"
                stroke="url(#grad)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
                style={{ transition: 'stroke-dashoffset 0.2s linear' }}
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="loading-modern-type" aria-live="polite">{typed}</span>
          </div>
          <div className="loading-modern-features">
            {featureList.map((f, i) => (
              <div className="loading-modern-feature" key={f.label} style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage; 