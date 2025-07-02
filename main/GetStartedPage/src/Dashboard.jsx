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

// Add a style object for base and hover states
const socialLinkBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 38,
  height: 38,
  borderRadius: '50%',
  background: 'rgba(139, 92, 246, 0.18)',
  border: '1.5px solid rgba(139, 92, 246, 0.25)',
  color: '#fff',
  textDecoration: 'none',
  transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
  backdropFilter: 'blur(4px)'
};
const githubHover = {
  background: 'rgba(36, 41, 46, 0.9)',
  borderColor: '#24292e',
  color: '#fff'
};
const linkedinHover = {
  background: 'rgba(0, 119, 181, 0.9)',
  borderColor: '#0077b5',
  color: '#fff'
};
const instagramHover = {
  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
  borderColor: '#dc2743',
  color: '#fff'
};

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
          className="heading responsive-welcome"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="welcome-main-text">Welcome,</span>
          <br className="mobile-welcome-break" />
          <span className="welcome-username">{currentUser?.username || 'User'}!</span>
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
              <motion.div className="creator-card animated-card naitik-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.3, type: 'spring', stiffness: 120 }} style={{ minWidth: 260, maxWidth: 320, background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)', borderRadius: '1.5rem', boxShadow: '0 4px 32px 0 #0002', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', position: 'relative' }}>
                <div className="creator-photo" style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', border: '3px solid #fff' }}>
                  <img src="/Naitik.jpeg" alt="Naitik Verma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800 }}>Naitik Verma</h4>
                <p style={{ fontSize: '1.08rem', margin: '0.2rem 0 0.7rem 0', opacity: 0.85, fontWeight: 600 }}>Co-Founder, PeerPath</p>
                <div className="creator-socials" style={{ display: 'flex', gap: '0.7rem', marginTop: '0.5rem' }}>
                  <motion.a
                    href="https://github.com/Naitik23verma"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialLinkBase}
                    whileHover={{ scale: 1.2, rotate: 5, ...githubHover }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/naitik-verma-869157318"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialLinkBase}
                    whileHover={{ scale: 1.2, rotate: 5, ...linkedinHover }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://www.instagram.com/naitikverma9111"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialLinkBase}
                    whileHover={{ scale: 1.2, rotate: 5, ...instagramHover }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.149 2.233 8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.048.014 8.328 0 8.736 0 12c0 3.264.014 3.672.073 4.952.2 4.358 2.622 6.776 6.98 6.976C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 4.358-.2 6.78-2.618 6.98-6.976.059-1.28.073-1.688.073-4.952 0-3.264-.014-3.672-.073-4.952-.2-4.358-2.622-6.776-6.98-6.976C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
              {/* Naitik's Views */}
              <motion.div className="creator-views animated-card naitik-views" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4, type: 'spring', stiffness: 120 }} style={{ minWidth: 220, maxWidth: 340, background: 'rgba(30,41,59,0.7)', borderRadius: '1.2rem', boxShadow: '0 2px 16px 0 #0002', padding: '1.5rem 1.2rem', color: '#e0e7ff', display: 'flex', alignItems: 'center', fontStyle: 'italic', fontSize: '1.1rem' }}>
                "PeerPath is a vision for collaborative learning and growth. Proud to build this community!" {/* Replace with your real view later */}
              </motion.div>
              {/* Satyam Sharma Card */}
              <motion.div className="creator-card animated-card satyam-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5, type: 'spring', stiffness: 120 }} style={{ minWidth: 260, maxWidth: 320, background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)', borderRadius: '1.5rem', boxShadow: '0 4px 32px 0 #0002', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', position: 'relative' }}>
                <div className="creator-photo" style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', border: '3px solid #fff' }}>
                  <img src="/Satyam.jpeg" alt="Satyam Sharma" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800 }}>Satyam Sharma</h4>
                <p style={{ fontSize: '1.08rem', margin: '0.2rem 0 0.7rem 0', opacity: 0.85, fontWeight: 600 }}>Co-Founder, PeerPath</p>
                <div className="creator-socials" style={{ display: 'flex', gap: '0.7rem', marginTop: '0.5rem' }}>
                  <motion.a
                    href="https://github.com/Satyam-hacker49"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialLinkBase}
                    whileHover={{ scale: 1.2, rotate: 5, ...githubHover }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/satyam-sharma-39a9ab324"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialLinkBase}
                    whileHover={{ scale: 1.2, rotate: 5, ...linkedinHover }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://www.instagram.com/satyam__sharmaa__"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialLinkBase}
                    whileHover={{ scale: 1.2, rotate: 5, ...instagramHover }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.149 2.233 8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.048.014 8.328 0 8.736 0 12c0 3.264.014 3.672.073 4.952.2 4.358 2.622 6.776 6.98 6.976C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 4.358-.2 6.78-2.618 6.98-6.976.059-1.28.073-1.688.073-4.952 0-3.264-.014-3.672-.073-4.952-.2-4.358-2.622-6.776-6.98-6.976C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
                    </svg>
                  </motion.a>
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
