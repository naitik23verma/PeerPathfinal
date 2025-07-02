import React, { useState, useEffect } from 'react';

const STAR_COUNT = 5;
const STORAGE_KEY = 'peerpath_ratings';
const USER_RATED_KEY = 'peerpath_user_rated';

function getStoredRatings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export default function Rating({ simple }) {
  const [ratings, setRatings] = useState(getStoredRatings());
  const average = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : '0.00';

  if (simple) {
    // Just show the average and non-interactive stars
    const avg = parseFloat(average);
    return (
      <div style={{ marginTop: 18, textAlign: 'center', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
          {[...Array(STAR_COUNT)].map((_, i) => (
            <span
              key={i}
              style={{
                fontSize: 28,
                color: avg > i ? '#ffd700' : '#444b5a',
                transition: 'color 0.2s',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              ★
            </span>
          ))}
        </div>
        <div style={{ color: '#c7d2fe', fontWeight: 600, fontSize: '1.1rem' }}>
          Site Rating: <span style={{ color: '#ffd700', fontWeight: 700 }}>{average}</span> / 5
        </div>
      </div>
    );
  }

  // ...existing interactive rating code...
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [userRated, setUserRated] = useState(localStorage.getItem(USER_RATED_KEY) === 'true');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  function handleClick(star) {
    if (userRated) return;
    setSelected(star);
    setRatings([...ratings, star]);
    setUserRated(true);
    localStorage.setItem(USER_RATED_KEY, 'true');
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      minWidth: 220,
      marginBottom: '1.5rem',
      background: 'rgba(20, 20, 40, 0.7)',
      boxShadow: '0 4px 24px rgba(60, 60, 120, 0.10)',
      borderRadius: 18,
    }}>
      <h3 style={{ color: '#90caf9', fontWeight: 700, fontSize: '1.3rem', marginBottom: 12 }}>Rate Our Site</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[...Array(STAR_COUNT)].map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: 36,
              color: (hovered || selected) > i ? '#ffd700' : '#444b5a',
              cursor: userRated ? 'not-allowed' : 'pointer',
              transition: 'color 0.2s',
              opacity: userRated && selected <= i ? 0.5 : 1,
            }}
            onMouseEnter={() => !userRated && setHovered(i + 1)}
            onMouseLeave={() => !userRated && setHovered(0)}
            onClick={() => handleClick(i + 1)}
            role="button"
            aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
          >
            ★
          </span>
        ))}
      </div>
      <div style={{ color: '#c7d2fe', fontWeight: 600, fontSize: '1.1rem' }}>
        Average: <span style={{ color: '#ffd700', fontWeight: 700 }}>{average}</span> / 5
      </div>
      <div style={{ color: '#a78bfa', fontSize: 13, marginTop: 6 }}>
        {ratings.length} rating{ratings.length === 1 ? '' : 's'} submitted
      </div>
      {userRated && (
        <div style={{ color: '#ffb357', marginTop: 10, fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
          You have already rated. Thank you!
        </div>
      )}
    </div>
  );
}
