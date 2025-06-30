import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BlurHeading from "./DashboardHeading.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import ScrollVelocity from "./components/ScrollVelocity.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import Squares from "./components/Squares.jsx";
import Ballpit from "./components/Ballpit.jsx";

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
                <img src="/PeerPathpurple.jpeg" alt="PeerPath Purple Logo" className="about-us-image" />
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
          className="about-creators-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{ marginTop: '10rem' }}
        >
          <div className="about-creators-content">
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              About the Creators
            </motion.h3>
            <motion.div 
              className="creator-cards"
              initial="initial"
              animate="animate"
            >
              <ProfileCard 
                name="Satyam Sharma"
                title="2nd Year CSE Student, MANIT"
                handle="satyamsharma"
                status="Online"
                contactText="Contact"
                avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
                onContactClick={() => console.log('Contact Satyam')}
              />
              <ProfileCard 
                name="Naitik Verma"
                title="2nd Year CSE Student, MANIT"
                handle="naitikverma"
                status="Online"
                contactText="Contact"
                avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"
                onContactClick={() => console.log('Contact Naitik')}
              />
              
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
