// ✅ Enhanced FrontPage for PeerPath
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarBackground from './components/StarBackground';
import TypewriterHeading from './components/TypewriterHeading';
import FallingText from './components/FallingText';
import Counter from './components/Counter';
import InfiniteMenu from './components/InfiniteMenu';
import AdvancedFooter from './components/AdvancedFooter.jsx';
import Email from "./Email.jsx"
import RollingGallery from './RollingGallery.jsx';
import HowItWorksMasonry from './components/HowItWorksMasonry.jsx';
import Rating from "./components/Rating.jsx";
import LottieAnimation from "./components/LottieAnimation.jsx";

// Add this before the FrontPage component definition
const reviews = [
  { text: "PeerPath is awesome!", author: "Student A" },
  { text: "Great platform for collaboration.", author: "Student B" },
  { text: "Mentorship helped me a lot!", author: "Student C" },
];

const FrontPage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Fetch usernames for falling text
  const [usernames, setUsernames] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        console.log('Fetched users from http://localhost:5000/api/users:', data);
        if (Array.isArray(data)) {
          setUsernames(data.map(u => u.username));
        }
      })
      .catch(err => {
        console.error('Error fetching users from http://localhost:5000/api/users:', err);
      });
  }, []);

  // Track user visits in backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token found:', !!token);
    if (!token) {
      console.log('No token found, skipping visit count update');
      return;
    }
    console.log('Sending visit count update request...');
    fetch('http://localhost:5000/api/users/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        console.log('Visit count response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Visit count updated successfully:', data);
      })
      .catch(err => {
        console.error('Error updating visit count:', err);
      });
  }, []);

  const handleFeatureClick = (feature) => {
    navigate(`/${feature}`);
  };

  const handleGetStarted = () => navigate('/dashboard');

  return (
    <motion.div
      className="front-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Top section with animated DotGrid background */}
      <section className="frontpage-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="frontpage-hero-content" style={{ position: 'relative', zIndex: 1 }}>
          {/* Star Background */}
          <StarBackground />

          {/* Background animation */}
          <motion.div className="front-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />

          {/* Hero Section */}
          <motion.div className="front-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <motion.div className="hero-section">
              <motion.div className="hero-text" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <h1 className="hero-title">
                  Welcome to Peer<span className="path-gradient">Path</span>
                </h1>
                <p className="hero-subtitle">Connect, Collaborate, and Grow Together</p>
                <p className="hero-description">Join a community of learners and mentors. Share knowledge, solve problems, and build amazing projects together.</p>
                <motion.button className="get-started-btn" onClick={handleGetStarted} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Get Started</motion.button>
              </motion.div>

              <motion.div className="hero-visual" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <motion.div className="floating-cards" variants={staggerContainer} initial="initial" animate="animate">
                  {[
                    { icon: '🧑‍🏫', text: 'Mentorship', key: 'mentorship' },
                    { icon: '🤝', text: 'Collaboration', key: 'collaboration' },
                    { icon: '📚', text: 'Resources', key: 'resources' },
                    { icon: '💡', text: 'Innovation', key: 'location' },
                  ].map((item, index) => (
                    <motion.div
                      className={`card card-${index + 1}`}
                      onClick={() => handleFeatureClick(item.key)}
                      key={item.key}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="card-icon">{item.icon}</span>
                      <span className="card-text">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div className="features-section" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <h2>What You Can Do</h2>
              <motion.div className="features-grid" variants={staggerContainer} initial="initial" animate="animate">
                {[
                  { icon: '🎯', title: 'Ask Questions', desc: 'Get help from peers and experts on any topic', path: 'mentorship' },
                  { icon: '🚀', title: 'Build Projects', desc: 'Collaborate on exciting projects', path: 'collaboration' },
                  { icon: '📖', title: 'Share Knowledge', desc: 'Contribute to the community', path: 'resources' },
                  { icon: '🗺️', title: 'Find Partners', desc: 'Connect with nearby people', path: 'location' },
                ].map(({ icon, title, desc, path }) => (
                  <motion.div
                    className="feature fancy-gradient-card box"
                    key={title}
                    onClick={() => handleFeatureClick(path)}
                    whileHover={{ scale: 1.1, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div className="feature-icon" whileHover={{ rotate: 360 }}>{icon}</motion.div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Falling Text Animation Section - Card */}
            <motion.div className="falling-text-section-card" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
              <div className="fancy-gradient-card">
                <h2>Users Already Using</h2>
                <FallingText
                  text={usernames.join(" ")}
                  highlightWords={[]}
                  trigger="scroll"
                  fontSize="1.2rem"
                  className="falling-text-custom"
                  gravity={0.3}
                  backgroundColor="transparent"
                />
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div className="stats-section" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <h2>Our Impact</h2>
              <div className="stats-grid">
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <div className="stat-number"><Counter end={10000} duration={7000} suffix="+" /></div>
                  <div className="stat-label">Active Students</div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <div className="stat-number"><Counter end={500} duration={7000} suffix="+" /></div>
                  <div className="stat-label">Projects Completed</div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <div className="stat-number"><Counter end={95} duration={7000} suffix="%" /></div>
                  <div className="stat-label">Success Rate</div>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <div className="stat-number"><Counter end={24} duration={7000} suffix="/7" /></div>
                  <div className="stat-label">Support Available</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Infinite Gallery Section */}
            <motion.div className="infinite-gallery-section" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}>
              <h2>Our Most Often Users</h2>
              <InfiniteMenu />
            </motion.div>

            {/* How It Works Section */}
            <HowItWorksMasonry />

            {/* ✅ New Section: Testimonials */}
            <motion.div className="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              <h2 className="stats-heading">What Students Say</h2>
              <div className="testimonial-grid">
                <motion.div className="testimonial" whileHover={{ scale: 1.02 }}>
                  <p>"PeerPath helped me find my dream project team!"</p>
                  <span>- Riya, Web Dev Enthusiast</span>
                </motion.div>
                <motion.div className="testimonial" whileHover={{ scale: 1.02 }}>
                  <p>"The mentorship feature is a game changer."</p>
                  <span>- Aarav, DSA Learner</span>
                </motion.div>
                <motion.div className="testimonial" whileHover={{ scale: 1.02 }}>
                  <p>"Amazing community and resources!"</p>
                  <span>- Priya, ML Enthusiast</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          {/* Move feedback-gallery-row outside of .front-content for full width */}
          <div className="feedback-gallery-row" style={{
            display: 'flex',
            gap: '1.5rem',
            width: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            paddingRight: 0,
            paddingBottom:'8rem',
            margin: '5rem auto',
          }}>
            {/* Left: Lottie Animation */}
            <div style={{
              flex: '0 0 auto',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <LottieAnimation large />
            </div>
            {/* Right: Feedback Form with Rating */}
            <div style={{
              flex: '0 0 auto',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingLeft: '11rem',
              margin: 0,
            }}>
              <Email showRating={true} compact={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Footer */}
      <AdvancedFooter />
    </motion.div>
  );
};

export default FrontPage;
