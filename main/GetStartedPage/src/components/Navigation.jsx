import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation = ({ onLogout }) => {
  const location = useLocation();

  // Animation variants
  const navVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 }
  };

  const linkVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/doubts', label: 'Doubts' },
    { to: '/collaboration', label: 'Collaboration' },
    { to: '/resources', label: 'Resources' },
    { to: '/chat', label: 'Chat' },
    { to: '/location', label: 'Location' },
    { to: '/profile', label: 'Profile' }
  ];

  return (
    <motion.nav 
      className="collaboration-nav"
      variants={navVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className="nav-logo"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <img src="/peerpath.png" alt="PeerPath" />
        <h1>PeerPath</h1>
      </motion.div>
      <motion.div 
        className="nav-links"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {navLinks.map((link) => (
          <motion.div key={link.to} variants={linkVariants} whileHover="hover">
            <Link 
              to={link.to} 
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
        <motion.button 
          onClick={onLogout} 
          className="logout-btn"
          variants={linkVariants}
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation; 