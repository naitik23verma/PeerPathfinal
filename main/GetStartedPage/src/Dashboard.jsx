import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BlurHeading from "./DashboardHeading.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import ScrollVelocity from "./components/ScrollVelocity.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import Squares from "./components/Squares.jsx";
import Ballpit from "./components/Ballpit.jsx";
import AdvancedFooter from "./components/AdvancedFooter.jsx";

import "./Dashboard.css";

const Card = ({ icon, title, description, onClick }) => (
  <motion.div 
    className="card" 
    onClick={onClick}
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ 
      scale: 1.05, 
      y: -10,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.5 }}
  >
    <div className="fade-in">
      <motion.div 
        className="icon"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
      <motion.button 
        className="get-started-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Get Started
      </motion.button>
    </div>
  </motion.div>
);

export default function Dashboard({ currentUser, onLogout }) {
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

  const handleMentorship = () => {
    navigate('/doubts');
  };

  const handleCollaboration = () => {
    navigate('/collaboration');
  };

  const handleResources = () => {
    navigate('/resources');
  };

  return (
    <motion.div 
      className="dashboard"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div 
        className="background"
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

      <motion.div 
        className="dashboard-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.h1 
          className="heading"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BlurHeading
            text={`Welcome, ${currentUser?.username || 'User'}!`}
            delay={100}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8"
          />
        </motion.h1>
        
        <motion.div 
          className="card-container"
          initial="initial"
          animate="animate"
          transition={{
            staggerChildren: 0.1
          }}
        >
          <Card className="fancy-gradient-card box"
            icon="🧑‍🏫"
            title="Start Mentorship"
            description="Get guidance from seniors on career, academics and more."
            onClick={handleMentorship}
          />
          <Card className="fancy-gradient-card box"
            icon="🤝"
            title="Start Collaborating"
            description="Team up with peers to build exciting projects."
            onClick={handleCollaboration}
          />
          <Card className="fancy-gradient-card box"
            icon="📚"
            title="Resources & Chats"
            description="Access past sessions, guides and peer content."
            onClick={handleResources}
          />
        </motion.div>

        {/* Scroll Velocity Announcements */}
        <ScrollVelocity 
          texts={[
            "🎉 Welcome to PeerPath - Connect, Learn, Grow Together",
            "📚 New Resources Available - Explore Study Materials & Guides"
          ]}
          velocity={50}
          className="text-white"
        />

        {/* About Us Section */}
        <motion.section 
          className="about-us-section"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="about-us-bg">
            <Ballpit 
              className="about-us-ballpit-bg"
              count={80}
              gravity={0.7}
              friction={0.8}
              wallBounce={0.95}
              followCursor={true}
              colors={[0x4c1d95, 0x5b21b6, 0x6d28d9, 0x7c3aed, 0x8b5cf6]}
            />
            <div className="about-us-gradient-overlay" />
          </div>
          <div className="about-us-content">
            <motion.div 
              className="about-us-left"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="about-us-image-card">
                <img src="/PeerPathblue.jpeg" alt="PeerPath Purple Logo" className="about-us-image" />
              </div>
            </motion.div>
            <motion.div 
              className="about-us-right"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <h2>About PeerPath</h2>
              <p className="about-us-motto">Connect. Learn. Grow. Together.</p>
              <p>
                <strong>PeerPath</strong> is a collaborative platform built by students, for students. Our mission is to empower learners to connect, share knowledge, and build projects together. Whether you need mentorship, want to collaborate, or simply seek resources, PeerPath is your go-to community.
              </p>
              <p>
                <strong>Our Goal:</strong> To create a supportive environment where everyone can ask questions, get guidance, and achieve more—together.
              </p>
              <p>
                <strong>Founders:</strong> Satyam Sharma, Naitik Verma
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* About the Creators section moved from Doubts.jsx */}
        <motion.section 
          className="about-creators-section full-width-creators"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{ marginTop: '10rem', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', background: 'transparent', border: 'none', boxShadow: 'none' }}
        >
          <div className="about-creators-content custom-creators-layout">
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              style={{ textAlign: 'center', width: '100%' }}
            >
              About the Creators
            </motion.h3>
            <div className="creators-row" style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: '2.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {/* Naitik Verma Card */}
              <motion.div className="creator-card animated-card naitik-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.3, type: 'spring', stiffness: 120 }} style={{ minWidth: 260, maxWidth: 320, background: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)', borderRadius: '1.5rem', boxShadow: '0 4px 32px 0 #0002', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', position: 'relative' }}>
                <div className="creator-photo" style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', border: '3px solid #fff' }}>
                  <img src="/naitik-photo.jpg" alt="Naitik Verma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ margin: 0 }}>Naitik Verma</h4>
                <p style={{ fontSize: '0.95rem', margin: '0.2rem 0 0.7rem 0', opacity: 0.8 }}>Co-Founder, PeerPath</p>
                <div className="creator-socials" style={{ display: 'flex', gap: '0.7rem', marginTop: '0.5rem' }}>
                  <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                </div>
              </motion.div>
              {/* Naitik's Views */}
              <motion.div className="creator-views animated-card naitik-views" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4, type: 'spring', stiffness: 120 }} style={{ minWidth: 220, maxWidth: 340, background: 'rgba(76,29,149,0.7)', borderRadius: '1.2rem', boxShadow: '0 2px 16px 0 #0002', padding: '1.5rem 1.2rem', color: '#e0e7ff', display: 'flex', alignItems: 'center', fontStyle: 'italic', fontSize: '1.1rem' }}>
                "PeerPath is a vision for collaborative learning and growth. Proud to build this community!" {/* Replace with your real view later */}
              </motion.div>
              {/* Satyam Sharma Card */}
              <motion.div className="creator-card animated-card satyam-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5, type: 'spring', stiffness: 120 }} style={{ minWidth: 260, maxWidth: 320, background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)', borderRadius: '1.5rem', boxShadow: '0 4px 32px 0 #0002', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', position: 'relative' }}>
                <div className="creator-photo" style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', border: '3px solid #fff' }}>
                  <img src="/satyam-photo.jpg" alt="Satyam Sharma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ margin: 0 }}>Satyam Sharma</h4>
                <p style={{ fontSize: '0.95rem', margin: '0.2rem 0 0.7rem 0', opacity: 0.8 }}>Co-Founder, PeerPath</p>
                <div className="creator-socials" style={{ display: 'flex', gap: '0.7rem', marginTop: '0.5rem' }}>
                  <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                </div>
              </motion.div>
              {/* Satyam's Views */}
              <motion.div className="creator-views animated-card satyam-views" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.6, type: 'spring', stiffness: 120 }} style={{ minWidth: 220, maxWidth: 340, background: 'rgba(30,41,59,0.7)', borderRadius: '1.2rem', boxShadow: '0 2px 16px 0 #0002', padding: '1.5rem 1.2rem', color: '#e0e7ff', display: 'flex', alignItems: 'center', fontStyle: 'italic', fontSize: '1.1rem' }}>
                "PeerPath is a platform where every learner can shine. Excited to see our impact grow!" {/* Replace with Satyam's real view later */}
              </motion.div>
            </div>
          </div>
        </motion.section>
      </motion.div>
      {/* Advanced Footer */}
      <AdvancedFooter />
    </motion.div>
  );
}
