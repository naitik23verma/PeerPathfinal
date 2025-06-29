import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from './components/NavigationBar.jsx';

const FrontPage = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const heroVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3, duration: 0.8 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.8, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: { 
      scale: 1.1, 
      y: -10,
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.9 }
  };

  const floatingCardVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    hover: { 
      scale: 1.2, 
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
    <motion.div 
      className="front-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div 
        className="front-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Navigation Bar */}
      <NavigationBar 
        currentUser={currentUser}
        onLogout={onLogout}
        showUserInfo={true}
        showNotifications={true}
        showSearch={false}
      />

      {/* Main Content */}
      <motion.div 
        className="front-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.div 
          className="hero-section"
          variants={heroVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Welcome to <motion.span 
                className="highlight"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                PeerPath
              </motion.span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Connect, Collaborate, and Grow Together
            </motion.p>
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Join a community of learners and mentors. Share knowledge, 
              solve problems, and build amazing projects together.
            </motion.p>
            <motion.button 
              className="get-started-btn" 
              onClick={handleGetStarted}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: 0.8 }}
            >
              Get Started
            </motion.button>
          </motion.div>
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div 
              className="floating-cards"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="card card-1" 
                onClick={() => handleFeatureClick('mentorship')}
                variants={floatingCardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.8 }}
              >
                <span className="card-icon">🧑‍🏫</span>
                <span className="card-text">Mentorship</span>
              </motion.div>
              <motion.div 
                className="card card-2" 
                onClick={() => handleFeatureClick('collaboration')}
                variants={floatingCardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.8 }}
              >
                <span className="card-icon">🤝</span>
                <span className="card-text">Collaboration</span>
              </motion.div>
              <motion.div 
                className="card card-3" 
                onClick={() => handleFeatureClick('resources')}
                variants={floatingCardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.8 }}
              >
                <span className="card-icon">📚</span>
                <span className="card-text">Resources</span>
              </motion.div>
              <motion.div 
                className="card card-4" 
                onClick={() => handleFeatureClick('location')}
                variants={floatingCardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.8 }}
              >
                <span className="card-icon">💡</span>
                <span className="card-text">Innovation</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="features-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            What You Can Do
          </motion.h2>
          <motion.div 
            className="features-grid"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="feature fancy-gradient-card box" 
              onClick={() => handleFeatureClick('mentorship')}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                🎯
              </motion.div>
              <h3>Ask Questions</h3>
              <p>Get help from peers and experts on any topic</p>
            </motion.div>
            <motion.div 
              className="feature fancy-gradient-card box" 
              onClick={() => handleFeatureClick('collaboration')}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                🚀
              </motion.div>
              <h3>Build Projects</h3>
              <p>Collaborate on exciting projects with like-minded people</p>
            </motion.div>
            <motion.div 
              className="feature fancy-gradient-card box" 
              onClick={() => handleFeatureClick('resources')}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                📖
              </motion.div>
              <h3>Share Knowledge</h3>
              <p>Contribute to the community by sharing your expertise</p>
            </motion.div>
            <motion.div 
              className="feature fancy-gradient-card box" 
              onClick={() => handleFeatureClick('location')}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                🗺️
              </motion.div>
              <h3>Find Partners</h3>
              <p>Connect with people going to the same places</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FrontPage; 