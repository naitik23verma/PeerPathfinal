import React, { useEffect, useState } from 'react';
import CircularGallery from './CircularGallery';
import { renderCardToCanvas } from './renderCardToCanvas';
import "./HowItWorksMasonry.css";

const Arrow = () => (
  <div className="feature-arrow">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M6 18h24M24 10l6 8-6 8" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const features = [
  {
    id: 1,
    title: "Sign Up",
    description: "Create your account and add skills. Secure and easy onboarding.",
    icon: "👤",
    steps: ["Register", "Upload photo"]
  },
  {
    id: 2,
    title: "Ask Questions",
    description: "Post doubts and get help.",
    icon: "❓",
    steps: ["Click 'Ask'", "Get answers"]
  },
  {
    id: 3,
    title: "Help Others",
    description: "Answer questions and share knowledge.",
    icon: "💡",
    steps: ["Browse", "Answer"]
  },
  {
    id: 4,
    title: "Collaborate",
    description: "Find team members for projects.",
    icon: "🤝",
    steps: ["Create post", "Find team"]
  },
  {
    id: 5,
    title: "Find Partners",
    description: "Connect with nearby learners. Enable location for best results.",
    icon: "🗺️",
    steps: ["Enable location", "Connect"]
  },
  {
    id: 6,
    title: "Explore Resources",
    description: "Browse study materials and guides.",
    icon: "📚",
    steps: ["Browse resources", "Download guides"]
  }
];

export default function HowItWorksMasonry() {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    async function prepareGalleryItems() {
      const items = [];
      for (const feature of features) {
        const cardJSX = (
          <div className="animated-border-card" style={{
            width: 320,
            height: 150,
            minWidth: 320,
            minHeight: 150,
            background: 'linear-gradient(135deg, #181825 60%, #312e81 100%)',
            color: '#fff',
            borderRadius: '20px',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontFamily: 'Inter, sans-serif',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              marginBottom: '0.7rem',
              justifyContent: 'center',
              width: '100%',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed 60%, #a78bfa 100%)',
                color: '#fff',
                borderRadius: '12px',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                boxShadow: '0 2px 8px rgba(124,58,237,0.15)'
              }}>{feature.icon}</div>
              <h3 style={{
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(31,38,135,0.10)'
              }}>{feature.title}</h3>
            </div>
            <p style={{
              fontSize: 18,
              margin: 0,
              marginBottom: 8,
              whiteSpace: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              opacity: 0.95,
              fontWeight: 500,
              textShadow: '0 1px 4px rgba(31,38,135,0.10)'
            }}>{feature.description}</p>
            <div style={{ width: '100%' }}>
              <h4 style={{
                fontSize: 15,
                margin: '0 0 2px 0',
                fontWeight: 700,
                textAlign: 'center',
                color: '#c7d2fe',
                letterSpacing: '0.2px'
              }}>How to use:</h4>
              <ol style={{
                fontSize: 15,
                margin: 0,
                paddingLeft: 0,
                listStylePosition: 'inside',
                textAlign: 'center',
                color: '#e0e7ff',
                fontWeight: 500
              }}>
                {feature.steps.map((step, i) => (
                  <li key={i} style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center',
                    marginBottom: 2
                  }}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        );
        const canvas = await renderCardToCanvas(cardJSX);
        items.push({ image: canvas.toDataURL(), text: feature.title });
      }
      setGalleryItems(items);
      console.log('Gallery Items:', items);
    }
    prepareGalleryItems();
  }, []);

  return (
    <div className="circulargallery-wrapper">
      <h2 className="stats-section-h2">How PeerPath Works - Complete Guide</h2>
      {galleryItems.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#fff' }}>Loading gallery...</div>
      ) : (
        <CircularGallery cards={galleryItems} bend={1.5} />
      )}
    </div>
  );
} 