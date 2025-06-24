import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Doubts.css";
import { TrendingDoubts } from './TrendingDoubts.jsx';
import { TopHelpers } from './TopHelpers.jsx';
import { AskDoubt } from './AskDoubt.jsx';

// DoubtCard styled like Top Helpers
function DoubtCard({ doubt, onSolve, onCall, onVideoCall, onChat, onLike, likedByCurrentUser, showMarkSolved, onMarkSolved, isAsker }) {
  return (
    <div className="helper-card doubt-card-carousel">
      <div className="helper-header">
        <div className="helper-avatar">
          <span className="avatar-emoji">❓</span>
        </div>
        <div className="helper-info">
          <h3 className="helper-name">{doubt.question}</h3>
          <div className="helper-rating">
            <span className="stars">Asked by: {typeof doubt.user === 'object' ? doubt.user.username : doubt.user}</span>
          </div>
        </div>
        <button
          className="like-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginLeft: 'auto', color: likedByCurrentUser ? '#fbbf24' : '#a78bfa' }}
          onClick={() => onLike(doubt)}
          title={likedByCurrentUser ? 'Unlike' : 'Like'}
        >
          👍 {doubt.likes?.length || 0}
        </button>
      </div>
      <div className="helper-bio">
        <p>{doubt.details}</p>
      </div>
      <div className="doubt-actions-carousel action-btn-row">
        <button className="call-btn small-action-btn" onClick={() => onCall(doubt)}>📞</button>
        {!isAsker && <button className="chat-btn small-action-btn" onClick={() => onChat(doubt)}>💬</button>}
        {showMarkSolved && <button className="solve-btn small-action-btn" onClick={() => onMarkSolved(doubt)}>✔️</button>}
      </div>
    </div>
  );
}

export default function Doubts({ currentUser, onLogout }){
    const [doubts, setDoubts] = useState([]);
    const [topHelpers, setTopHelpers] = useState([]);
    const [showAskDoubt, setShowAskDoubt] = useState(false);
    const [error, setError] = useState('');

    // Carousel for doubts
    const [carouselIndex, setCarouselIndex] = useState(0);
    const scrollDoubtsLeft = () => setCarouselIndex(i => Math.max(i - 1, 0));
    const scrollDoubtsRight = () => setCarouselIndex(i => Math.min(i + 1, Math.max(0, mappedDoubts.length - 3)));

    // Call/Video Call handlers
    const handleCall = (doubt) => {
      alert(`Initiating call to the asker of: ${doubt.question}`);
    };
    const handleVideoCall = (doubt) => {
      alert(`Starting video call for: ${doubt.question}`);
    };
    const navigate = useNavigate();
    const handleChat = (doubt) => {
      // Always open chat with the asker
      let askerId = null;
      if (typeof doubt.user === 'object') {
        askerId = doubt.user._id;
      } else {
        askerId = doubt.userId || doubt.user;
      }
      if (askerId && currentUser && askerId !== currentUser._id) {
        navigate('/chat', { state: { userId: askerId } });
      }
    };
    const handleSolve = async (doubt) => {
      try {
        // Mark the doubt as solved in the backend
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/doubts/${doubt.id}/solve`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Remove the solved doubt from the list
        setDoubts(prev => prev.filter(d => (d._id || d.id) !== doubt.id));
        // Optionally, increment the solver's count (fetch profile or update state)
      } catch (error) {
        alert('Failed to mark as solved.');
      }
    };
    const handleLike = async (doubt) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:5000/api/doubts/${doubt.id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Update the local state with the new like count
        setDoubts(prev => prev.map(d => (d._id || d.id) === doubt.id ? { ...d, likes: response.data.doubt.likes } : d));
      } catch (error) {
        alert('Failed to like/unlike doubt.');
      }
    };

    useEffect(() => {
        fetchDoubts();
        fetchTopHelpers();
    }, []);

    const fetchDoubts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/doubts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubts(response.data.doubts);
        } catch (error) {
            console.error('Error fetching doubts:', error);
            setError('Failed to load doubts');
        }
    };

    const fetchTopHelpers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/top-helpers');
            setTopHelpers(response.data);
        } catch (error) {
            console.error('Error fetching top helpers:', error);
        }
    };

    const handleDoubtSubmit = async (newDoubt) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/doubts', newDoubt, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Doubt posted:', response.data);
            setDoubts(prevDoubts => [response.data.doubt, ...prevDoubts]);
            setShowAskDoubt(false);
        } catch (error) {
            console.error('Error creating doubt:', error, error.response?.data);
            setError('Failed to create doubt');
        }
    };

    const handleDoubtUpdate = (updatedDoubts) => {
        setDoubts(updatedDoubts);
    };

    // Map backend doubts to TrendingDoubts structure
    const mappedDoubts = (doubts || [])
      .filter(doubt => doubt && typeof doubt === 'object')
      .map(doubt => ({
        id: doubt._id || doubt.id,
        question: doubt.title || doubt.question || '',
        user: typeof doubt.user === 'object' ? (doubt.user.username || doubt.user.name || 'Unknown') : (doubt.user || 'Unknown'),
        details: doubt.content || doubt.details || '',
        time: doubt.time || doubt.createdAt || '',
        replies: doubt.replies || (doubt.answers ? doubt.answers.length : 0) || 0,
        likes: doubt.likes || 0,
        category: doubt.category || 'general',
        tags: Array.isArray(doubt.tags) ? doubt.tags.map(t => String(t)) : [],
        isResolved: typeof doubt.isResolved === 'boolean' ? doubt.isResolved : false
      }))
      .filter(d => d.question && typeof d.question === 'string');
    console.log('mappedDoubts:', mappedDoubts);

    // Sort mappedDoubts by like count descending
    const sortedDoubts = [...mappedDoubts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    const handleMarkSolved = async (doubt) => {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/doubts/${doubt.id}/solve`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoubts(prev => prev.filter(d => (d._id || d.id) !== doubt.id));
      } catch (error) {
        alert('Failed to mark as solved.');
      }
    };

    return(
        <div className="doubts-page-container">
            <nav className="collaboration-nav">
                <div className="nav-logo">
                    <img src="/peerpath.png" alt="PeerPath" />
                    <h1>PeerPath</h1>
                </div>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/doubts" className="active">Doubts</Link>
                    <Link to="/collaboration">Collaboration</Link>
                    <Link to="/resources">Resources</Link>
                    <Link to="/chat">Chat</Link>
                    <Link to="/location">Location</Link>
                    <Link to="/profile">Profile</Link>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
            
            <main className="doubts-main-content">
                <div className="doubts-hero-section">
                    <h1>
                        Together We Learn.<span className="center-grow">Together We Build.</span>
                    </h1>
                    <p style={{fontSize:30}}>A space for all your doubts.</p>
                    <button 
                        className="ask-doubt-hero-btn"
                        onClick={() => setShowAskDoubt(!showAskDoubt)}
                    >
                        {showAskDoubt ? 'Close Form' : '🤔 Ask Your Doubt'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="doubts-body-content">
                    {showAskDoubt && (
                        <div className="ask-doubt-modal">
                             <AskDoubt 
                                currentUser={currentUser} 
                                onDoubtSubmit={handleDoubtSubmit}
                                onCancel={() => setShowAskDoubt(false)}
                            />
                        </div>
                    )}

                    {/* Doubts Carousel - now above Top Helpers */}
                    <div className="carousel-wrapper">
                      {carouselIndex > 0 && (
                        <button className="scroll-btn scroll-left" onClick={scrollDoubtsLeft}>‹</button>
                      )}
                      <div className="carousel-container">
                        <div className="carousel-track" style={{ transform: `translateX(-${carouselIndex * 350}px)` }}>
                          {sortedDoubts.map((doubt, idx) => (
                            <DoubtCard
                              key={doubt.id || idx}
                              doubt={doubt}
                              onSolve={handleSolve}
                              onCall={handleCall}
                              onVideoCall={handleVideoCall}
                              onChat={handleChat}
                              onLike={handleLike}
                              likedByCurrentUser={Array.isArray(doubt.likes) && currentUser && doubt.likes.some(id => id === currentUser._id)}
                              showMarkSolved={currentUser && (typeof doubt.user === 'object' ? doubt.user.username : doubt.user) === currentUser.username}
                              onMarkSolved={handleMarkSolved}
                              isAsker={currentUser && (typeof doubt.user === 'object' ? doubt.user._id : doubt.user) === currentUser._id}
                            />
                          ))}
                        </div>
                      </div>
                      {carouselIndex < Math.max(0, mappedDoubts.length - 3) && (
                        <button className="scroll-btn scroll-right" onClick={scrollDoubtsRight}>›</button>
                      )}
                    </div>

                    {/* Top Helpers section below doubts */}
                    <TopHelpers />
                </div>

                <section className="about-creators-section">
                    <div className="about-creators-content">
                        <h3>About the Creators</h3>
                        <div className="creator-cards">
                            <div className="creator-card">
                                <div className="creator-image-placeholder" />
                                <h4>Satyam Sharma</h4>
                                <p>2nd Year CSE Student, MANIT</p>
                                <div className="creator-socials">
                                    <a href="#" aria-label="LinkedIn">L</a>
                                    <a href="#" aria-label="GitHub">G</a>
                                </div>
                            </div>
                            <div className="creator-card">
                                <div className="creator-image-placeholder" />
                                <h4>Naitik Verma</h4>
                                <p>2nd Year CSE Student, MANIT</p>
                                <div className="creator-socials">
                                    <a href="#" aria-label="LinkedIn">L</a>
                                    <a href="#" aria-label="GitHub">G</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="doubts-footer">
                <div className="footer-content">
                    <div className="footer-bottom">
                        <p>© 2025 PeerPath. All rights reserved.</p>
                        <p>Made with ❤️ by the PeerPath Team</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}