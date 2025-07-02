import React, { useState } from 'react';

export default function FeatureRequest() {
  const [feature, setFeature] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // For now, just show thank you. In production, send to backend or email.
    setSubmitted(true);
    setFeature('');
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 320,
      background: 'rgba(20, 20, 40, 0.7)',
      borderRadius: 18,
      boxShadow: '0 4px 24px rgba(60, 60, 120, 0.10)',
      padding: '1.5rem 1.2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 0,
    }}>
      <h3 style={{ color: '#90caf9', fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, textAlign: 'center' }}>
        Suggest a Feature
      </h3>
      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <textarea
          value={feature}
          onChange={e => setFeature(e.target.value)}
          placeholder="What would make PeerPath better?"
          required
          style={{
            width: '100%',
            minHeight: 60,
            borderRadius: 8,
            border: '1px solid #444b5a',
            background: 'rgba(30, 30, 60, 0.7)',
            color: '#e0e0e0',
            fontSize: 15,
            padding: '0.7rem 1rem',
            marginBottom: 10,
            outline: 'none',
            resize: 'vertical',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
        <button type="submit" style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          color: '#fff',
          border: 'none',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: 1,
          marginTop: 4,
          cursor: 'pointer',
          alignSelf: 'center',
          transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
          padding: '0.5rem 1.5rem',
          borderRadius: 30,
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.15)',
        }}>
          Submit
        </button>
        {submitted && <div style={{ color: '#ffb357', marginTop: 10, fontSize: 14, fontWeight: 500, textAlign: 'center' }}>Thank you for your suggestion!</div>}
      </form>
    </div>
  );
} 