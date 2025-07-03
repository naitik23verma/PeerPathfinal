import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './SignUp.css';

const SignUp = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    bio: '',
    year: '',
    expertise: '',
    skills: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const containerVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, delay: 0.2 }
  };

  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3 }
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Mobile number validation
    if (formData.mobileNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('mobileNumber', formData.mobileNumber);
      data.append('bio', formData.bio);
      data.append('year', formData.year);
      data.append('expertise', formData.expertise);
      data.append('skills', formData.skills);
      
      if (profilePhoto) {
        data.append('profilePhoto', profilePhoto);
      }

      const response = await axios.post(`https://peerpathfinal.onrender.com/api/auth/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.token) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        onRegister(user);
        navigate('/front');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="signup-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div 
        className="signup-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="signup-container"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="signup-header"
            variants={headerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.img 
              src="/peerpath.png" 
              alt="PeerPath" 
              className="signup-logo"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join PeerPath
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Create your account and start connecting with peers
            </motion.p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="signup-form"
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
                <label htmlFor="username">Username *</label>
                <motion.input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="email">Email *</label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="password">Password *</label>
                <motion.input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <motion.input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="mobileNumber">Mobile Number</label>
                <motion.input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="year">Year of Study *</label>
                <motion.select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  whileFocus="focus"
                  variants={inputVariants}
                >
                  <option value="">Select your year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </motion.select>
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="expertise">Areas of Expertise</label>
                <motion.input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  placeholder="e.g., Web Development, Machine Learning, Design"
                  whileFocus="focus"
                  variants={inputVariants}
                />
                <small>Separate multiple areas with commas</small>
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="skills">Skills</label>
                <motion.input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Python, UI/UX, Communication"
                  whileFocus="focus"
                  variants={inputVariants}
                />
                <small>Separate multiple skills with commas</small>
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="bio">Bio</label>
                <motion.textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  whileFocus="focus"
                  variants={inputVariants}
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="profilePhoto">Profile Photo</label>
                <motion.input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  onChange={handlePhotoChange}
                  accept="image/*"
                  whileFocus="focus"
                  variants={inputVariants}
                />
                {previewPhoto && (
                  <motion.img
                    src={previewPhoto}
                    alt="Preview"
                    className="photo-preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </motion.div>

            <motion.button 
              type="submit" 
              className={`signup-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: 0.8 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </motion.form>

          <motion.div 
            className="signup-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <p>
              Already have an account?{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login">Sign In</Link>
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignUp; 