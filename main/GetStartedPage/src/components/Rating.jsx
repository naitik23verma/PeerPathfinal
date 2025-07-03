import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STAR_COUNT = 5;
const USER_RATED_KEY = 'peerpath_user_rated_email';

export default function Rating({ simple, currentUser }) {
  const [average, setAverage] = useState('0.00');
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [userRated, setUserRated] = useState(false);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    fetchAverage();
    // Check if user has already rated (by email)
    const ratedEmail = localStorage.getItem(USER_RATED_KEY);
    if (currentUser?.email && ratedEmail === currentUser.email) {
      setUserRated(true);
    }
  }, [currentUser]);

  const fetchAverage = async () => {
    try {
      const res = await axios.get('/api/ratings');
      setAverage(res.data.average);
      setCount(res.data.count);
    } catch (e) {
      setAverage('0.00');
      setCount(0);
    }
  };

  const handleClick = async (star) => {
    if (userRated) return;
    if (!email) {
      setShowEmailInput(true);
      return;
    }
    setSelected(star);
    try {
      await axios.post('/api/ratings', { value: star, email });
      setUserRated(true);
      localStorage.setItem(USER_RATED_KEY, email);
      fetchAverage();
    } catch (e) {
      // Optionally show error
    }
  };

  if (simple) {
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
        <div style={{ color: '#a78bfa', fontSize: 13, marginTop: 6 }}>
          {count} rating{count === 1 ? '' : 's'} submitted
        </div>
      </div>
    );
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
      {showEmailInput && !email && (
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginBottom: 10, padding: 6, borderRadius: 6, border: '1px solid #a78bfa' }}
        />
      )}
      <div style={{ color: '#c7d2fe', fontWeight: 600, fontSize: '1.1rem' }}>
        Average: <span style={{ color: '#ffd700', fontWeight: 700 }}>{average}</span> / 5
      </div>
      <div style={{ color: '#a78bfa', fontSize: 13, marginTop: 6 }}>
        {count} rating{count === 1 ? '' : 's'} submitted
      </div>
      {userRated && (
        <div style={{ color: '#ffb357', marginTop: 10, fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
          You have already rated. Thank you!
        </div>
      )}
    </div>
  );
}
