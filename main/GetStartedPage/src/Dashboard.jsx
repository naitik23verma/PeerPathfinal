import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BlurHeading from "./DashboardHeading.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import ScrollVelocity from "./components/ScrollVelocity.jsx";

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

        
      </motion.div>
    </motion.div>
  );
}
