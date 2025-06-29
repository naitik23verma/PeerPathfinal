import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import './NavigationBar.css';
const NavigationBar = ({ 
  onLogout, 
  currentUser, 
  showUserInfo = true,
  showNotifications = true,
  showSearch = false,
  onSearch = null,
  className = '',
  variant = 'default' // 'default', 'minimal', 'transparent'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Animation variants
  const navVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 }
  };

  const linkVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05, y: -2 }
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3 }
    },
    open: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Navigation links configuration
  const navLinks = [
    { 
      to: '/dashboard', 
      label: 'Dashboard', 
      description: 'View your dashboard'
    },
    { 
      to: '/doubts', 
      label: 'Doubts', 
      description: 'Ask and answer doubts'
    },
    { 
      to: '/collaboration', 
      label: 'Collaboration', 
      description: 'Join projects and collaborate'
    },
    { 
      to: '/resources', 
      label: 'Resources', 
      description: 'Access study materials'
    },
    { 
      to: '/chat', 
      label: 'Chat', 
      description: 'Connect with peers'
    },
    { 
      to: '/location', 
      label: 'Location', 
      description: 'Find ride sharing'
    },
    { 
      to: '/profile', 
      label: 'Profile', 
      description: 'Manage your profile'
    }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  // Get current page info
  const currentPage = navLinks.find(link => link.to === location.pathname);

  return (
    <motion.nav 
      className={`navigation-bar ${variant} ${isScrolled ? 'scrolled' : ''} ${className}`}
      variants={navVariants}
      initial="initial"
      animate="animate"
    >
      <div className="nav-container">
        {/* Logo Section */}
        <motion.div 
          className="nav-logo-section"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/dashboard" className="logo-link">
            <img src="/peerpath.png" alt="PeerPath" className="logo-image" />
            <motion.h1 
              className="logo-text"
              whileHover={{ color: '#a78bfa' }}
              transition={{ duration: 0.2 }}
            >
              PeerPath
            </motion.h1>
          </Link>
        </motion.div>

        {/* Search Bar (if enabled) */}
        {showSearch && (
          <motion.div 
            className="nav-search"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <motion.button 
                type="submit" 
                className="search-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                🔍
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Desktop Navigation Links */}
        <motion.div 
          className="nav-links-desktop"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {navLinks.map((link) => (
            <motion.div 
              key={link.to} 
              className="nav-link-wrapper"
              variants={linkVariants} 
              whileHover="hover"
            >
              <Link 
                to={link.to} 
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                title={link.description}
              >
                <span className="link-label">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* User Section */}
        <motion.div 
          className="nav-user-section"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* User Info */}
          {showUserInfo && currentUser && (
            <motion.div 
              className="nav-user-info"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="user-link"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
                title="Click to logout"
              >
                <img 
                  src={currentUser.profilePhoto ? `http://localhost:5000${currentUser.profilePhoto}` : '/peerpath.png'} 
                  alt={currentUser.username || 'User'} 
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src = '/peerpath.png';
                  }}
                />
                <span className="user-name">{currentUser.username || 'User'}</span>
              </div>
            </motion.div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-nav-menu"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="mobile-nav-links">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={link.to} 
                    className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-link-label">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// PropTypes for type checking
NavigationBar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    profilePhoto: PropTypes.string,
    email: PropTypes.string
  }),
  showUserInfo: PropTypes.bool,
  showNotifications: PropTypes.bool,
  showSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'minimal', 'transparent'])
};

// Default props
NavigationBar.defaultProps = {
  showUserInfo: true,
  showNotifications: true,
  showSearch: false,
  className: '',
  variant: 'default'
};

export default NavigationBar; 