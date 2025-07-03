import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, delay: 0.2 }
  };

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4, duration: 0.5 }
  };

  const inputVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    focus: { scale: 1.02 }
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.user);
        navigate('/front');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="login-container"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div 
        className="login-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="login-card"
        variants={cardVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="login-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.img 
            src="/peerpath.png" 
            alt="PeerPath" 
            className="login-logo"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome Back to PeerPath
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Connect, Learn, and Grow Together
          </motion.p>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="login-form"
          variants={formVariants}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="form-group"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={inputVariants}>
              <label htmlFor="username">Username</label>
              <motion.input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                whileFocus="focus"
                variants={inputVariants}
              />
            </motion.div>
            
            <motion.div variants={inputVariants}>
              <label htmlFor="password">Password</label>
              <motion.input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                whileFocus="focus"
                variants={inputVariants}
              />
            </motion.div>
          </motion.div>
          
          <motion.button 
            type="submit" 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 0.6 }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </motion.form>
        
        <motion.div 
          className="login-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p>
            Don't have an account?{' '}
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup">Sign Up</Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login; 