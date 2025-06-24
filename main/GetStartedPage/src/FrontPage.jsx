import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';
import { Link } from 'react-router-dom';

const FrontPage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleFeatureClick = (feature) => {
    switch (feature) {
      case 'mentorship':
        navigate('/mentorship');
        break;
      case 'collaboration':
        navigate('/collaboration');
        break;
      case 'resources':
        navigate('/resources');
        break;
      case 'location':
        navigate('/location');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="front-page">
      <div className="front-background"></div>
      
      {/* Navigation Header, now outside the background div */}
      <nav className="collaboration-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/doubts">Doubts</Link>
          <Link to="/collaboration">Collaboration</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/location">Location</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Main Content, now outside the background div */}
      <div className="front-content">
        <div className="hero-section">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="highlight">PeerPath</span>
            </h1>
            <p className="hero-subtitle">
              Connect, Collaborate, and Grow Together
            </p>
            <p className="hero-description">
              Join a community of learners and mentors. Share knowledge, 
              solve problems, and build amazing projects together.
            </p>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card card-1" onClick={() => handleFeatureClick('mentorship')}>
                <span className="card-icon">🧑‍🏫</span>
                <span className="card-text">Mentorship</span>
              </div>
              <div className="card card-2" onClick={() => handleFeatureClick('collaboration')}>
                <span className="card-icon">🤝</span>
                <span className="card-text">Collaboration</span>
              </div>
              <div className="card card-3" onClick={() => handleFeatureClick('resources')}>
                <span className="card-icon">📚</span>
                <span className="card-text">Resources</span>
              </div>
              <div className="card card-4" onClick={() => handleFeatureClick('location')}>
                <span className="card-icon">💡</span>
                <span className="card-text">Innovation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>What You Can Do</h2>
          <div className="features-grid">
            <div className="feature" onClick={() => handleFeatureClick('mentorship')}>
              <div className="feature-icon">🎯</div>
              <h3>Ask Questions</h3>
              <p>Get help from peers and experts on any topic</p>
            </div>
            <div className="feature" onClick={() => handleFeatureClick('collaboration')}>
              <div className="feature-icon">🚀</div>
              <h3>Build Projects</h3>
              <p>Collaborate on exciting projects with like-minded people</p>
            </div>
            <div className="feature" onClick={() => handleFeatureClick('resources')}>
              <div className="feature-icon">📖</div>
              <h3>Share Knowledge</h3>
              <p>Contribute to the community by sharing your expertise</p>
            </div>
            <div className="feature" onClick={() => handleFeatureClick('location')}>
              <div className="feature-icon">🗺️</div>
              <h3>Find Partners</h3>
              <p>Connect with people going to the same places</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage; 