import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './TopHelpers.css';

export function TopHelpers() {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef(null);

  // Fetch top helpers from the database
  const fetchTopHelpers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/top-helpers');
      console.log('Top helpers data:', response.data);
      
      // Transform the data to match the expected format
      const transformedHelpers = response.data.map((user, index) => ({
        id: user._id,
        name: user.username,
        level: getLevel(user.doubtsSolved),
        solved: user.doubtsSolved || 0,
        bio: user.bio || 'Passionate about helping others and sharing knowledge.',
        expertise: Array.isArray(user.expertise)
          ? (
              user.expertise.length === 1 && user.expertise[0].includes(',')
                ? user.expertise[0].split(',').map(e => e.trim())
                : user.expertise
            )
          : (user.expertise ? user.expertise.split(',').map(e => e.trim()) : []),
        rating: calculateRating(user.doubtsSolved),
        avatar: getAvatar(user.profilePhoto),
        badges: generateBadges(user.doubtsSolved, user.expertise),
        profilePhoto: user.profilePhoto
      }));
      
      setHelpers(transformedHelpers);
      setError(null);
    } catch (error) {
      console.error('Error fetching top helpers:', error);
      setError('Failed to load top helpers');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to transform data
  const getLevel = (doubtsSolved) => {
    if (doubtsSolved >= 50) return 'Mentor Lv. 3';
    if (doubtsSolved >= 30) return 'Mentor Lv. 2';
    if (doubtsSolved >= 15) return 'Mentor Lv. 1';
    if (doubtsSolved >= 5) return 'Helpful Peer';
    return 'New Helper';
  };

  const calculateRating = (doubtsSolved) => {
    if (doubtsSolved >= 50) return 4.9;
    if (doubtsSolved >= 30) return 4.8;
    if (doubtsSolved >= 15) return 4.7;
    if (doubtsSolved >= 5) return 4.6;
    return 4.5;
  };

  const getAvatar = (profilePhoto) => {
    if (profilePhoto) {
      return profilePhoto; // Return the actual profile photo URL
    }
    // Return emoji avatars as fallback
    const emojis = ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🔬', '👨‍📱', '👩‍🎨', '👨‍💼'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const generateBadges = (doubtsSolved, expertise) => {
    const badges = [];
    
    if (doubtsSolved >= 50) badges.push('Top Mentor');
    if (doubtsSolved >= 30) badges.push('Senior Helper');
    if (doubtsSolved >= 15) badges.push('Active Mentor');
    if (doubtsSolved >= 5) badges.push('Helpful Peer');
    
    if (expertise && expertise.length > 0) {
      badges.push(`${expertise[0]} Expert`);
    }
    
    return badges.length > 0 ? badges : ['Community Helper'];
  };

  useEffect(() => {
    fetchTopHelpers();
  }, []);

  const handleOpen = (helper) => {
    setSelected(helper);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons);
      return () => carousel.removeEventListener('scroll', checkScrollButtons);
    }
  }, [helpers]); // Re-check when helpers data changes

  return (
    <div className="top-helpers-section">
      <div className="section-header">
        <h2 className="section-title">🌟 Top Doubt Solvers</h2>
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to see all helpers</span>
          <span className="scroll-arrow">→</span>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#a78bfa' }}>
          Loading top helpers...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {!loading && !error && helpers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#a78bfa' }}>
          No helpers found. Be the first to solve doubts!
        </div>
      )}

      {!loading && !error && helpers.length > 0 && (
        <div className="carousel-wrapper">
          {canScrollLeft && (
            <button className="scroll-btn scroll-left" onClick={scrollLeft}>
              ‹
            </button>
          )}
          
          <div className="carousel-container" ref={carouselRef}>
            <div className="carousel-track">
              {helpers.map((helper) => (
                <div
                  className="helper-card"
                  key={helper.id}
                  onClick={() => handleOpen(helper)}
                >
                  <div className="helper-header">
                    <div className="helper-avatar">
                      {helper.profilePhoto ? (
                        <img 
                          src={`http://localhost:5000${helper.profilePhoto}`} 
                          alt={helper.name} 
                          className="avatar-image"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        <span className="avatar-emoji">{helper.avatar}</span>
                      )}
                      <div className="level-badge">{helper.level}</div>
                    </div>
                    <div className="helper-info">
                      <h3 className="helper-name">{helper.name}</h3>
                      <div className="helper-rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="rating-text">{helper.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="helper-stats">
                    <div className="stat-item">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-value">{helper.solved}</span>
                      <span className="stat-label">Solved</span>
                    </div>
                  </div>

                  <div className="helper-expertise">
                    <h4>Expertise:</h4>
                    <div className="expertise-tags">
                      {helper.expertise.map((skill, idx) => (
                        <span key={idx} className="expertise-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="helper-bio">
                    <p>{helper.bio}</p>
                  </div>

                  <button className="view-profile-btn">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>

          {canScrollRight && (
            <button className="scroll-btn scroll-right" onClick={scrollRight}>
              ›
            </button>
          )}
        </div>
      )}

      {open && selected && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content helper-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose} aria-label="Close">
              &times;
            </button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                {selected.profilePhoto ? (
                  <img 
                    src={`http://localhost:5000${selected.profilePhoto}`} 
                    alt={selected.name} 
                    className="avatar-image large"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <span className="avatar-emoji large">{selected.avatar}</span>
                )}
              </div>
              <div className="level-badge">{selected.level}</div>
              <div className="modal-info">
                <h2>{selected.name}</h2>
                <div className="modal-rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">{selected.rating} Rating</span>
                </div>
              </div>
            </div>

            <div className="modal-stats">
              <div className="stat-card">
                <span className="stat-icon">🏆</span>
                <div className="stat-details">
                  <span className="stat-value">{selected.solved}</span>
                  <span className="stat-label">Questions Solved</span>
                </div>
              </div>
            </div>

            <div className="modal-expertise">
              <h3>Expertise</h3>
              <div className="expertise-tags">
                {selected.expertise.map((skill, idx) => (
                  <span key={idx} className="expertise-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="modal-bio">
              <h3>About</h3>
              <p>{selected.bio}</p>
            </div>

            <div className="modal-actions">
              <button className="contact-btn">Contact Helper</button>
              <button className="view-solutions-btn">View Solutions</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}