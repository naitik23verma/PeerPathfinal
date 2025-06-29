import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera } from 'react-icons/fa';
import NavigationBar from './components/NavigationBar.jsx';

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    bio: '',
    year: '',
    expertise: [],
    skills: [],
    doubtsSolved: 0,
    doubtsAsked: 0,
    joinDate: '',
    profilePhoto: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [weeklyDoubts, setWeeklyDoubts] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const statVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const tagVariants = {
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
      return;
    }

    setCurrentUser(user);
    fetchUserProfile(user._id);
    fetchWeeklyDoubts(user._id, token);
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched user profile data:', response.data);
      console.log('Profile photo from server:', response.data.profilePhoto);
      
      setProfileData(prev => ({
        ...prev,
        username: response.data.username || '',
        email: response.data.email || '',
        mobileNumber: response.data.mobileNumber || '',
        bio: response.data.bio || '',
        year: response.data.year || '',
        expertise: response.data.expertise || [],
        skills: response.data.skills || [],
        doubtsSolved: response.data.doubtsSolved || 0,
        doubtsAsked: response.data.doubtsAsked || 0,
        joinDate: response.data.joinDate || new Date().toISOString(),
        profilePhoto: response.data.profilePhoto || '',
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchWeeklyDoubts = async (userId, token) => {
    try {
      console.log('Fetching weekly doubts for user:', userId);
      const response = await axios.get(`http://localhost:5000/api/doubts/weekly/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Weekly doubts response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setWeeklyDoubts(response.data);
        console.log('Weekly doubts set successfully:', response.data);
      } else {
        console.error('Invalid weekly doubts data format:', response.data);
        setWeeklyDoubts([]);
      }
    } catch (error) {
      console.error('Error fetching weekly doubts:', error);
      console.error('Error response:', error.response?.data);
      setWeeklyDoubts([]);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', 
        {
          bio: profileData.bio,
          year: profileData.year,
          expertise: profileData.expertise.join(','),
          skills: profileData.skills.join(',')
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !profileData.expertise.includes(newExpertise.trim())) {
      setProfileData({
        ...profileData,
        expertise: [...profileData.expertise, newExpertise.trim()]
      });
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertiseToRemove) => {
    setProfileData({
      ...profileData,
      expertise: profileData.expertise.filter(item => item !== expertiseToRemove)
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  const stats = [
    { label: 'Doubts Solved', value: profileData.doubtsSolved || 0 },
    { label: 'Doubts Asked', value: profileData.doubtsAsked || 0 },
    { label: 'Days Active', value: (() => {
      try {
        const joinDate = new Date(profileData.joinDate);
        if (isNaN(joinDate.getTime())) return 0;
        const daysDiff = Math.ceil((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff > 0 ? daysDiff : 0;
      } catch (error) {
        return 0;
      }
    })() }
  ];

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePhoto', file);
      const response = await axios.post('http://localhost:5000/api/users/upload-profile-photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData((prev) => ({ ...prev, profilePhoto: response.data.profilePhoto }));
      // Update the user in localStorage as well
      const currentUserData = JSON.parse(localStorage.getItem('user'));
      const updatedUserData = { ...currentUserData, profilePhoto: response.data.profilePhoto };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      // Refresh the profile data to ensure everything is up to date
      if (currentUser) {
        fetchUserProfile(currentUser._id);
      }
      alert('Profile photo updated!');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      alert('Failed to upload profile photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      className="profile-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <NavigationBar 
        currentUser={currentUser}
        onLogout={onLogout}
        showUserInfo={true}
        showNotifications={true}
        showSearch={false}
      />

      <div className="profile-content">
        <motion.div 
          className="profile-header fancy-gradient-card"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="profile-avatar"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {profileData.profilePhoto ? (
              <>
                <img 
                  src={`http://localhost:5000${profileData.profilePhoto}`} 
                  alt="Profile" 
                  className="avatar-image" 
                />
                <motion.label 
                  className="camera-icon-overlay"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaCamera size={22} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfilePhotoChange}
                    disabled={uploading}
                  />
                </motion.label>
              </>
            ) : (
              <>
                <span className="avatar-text">{profileData.username.charAt(0)}</span>
                <motion.label 
                  className="camera-icon-overlay"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaCamera size={22} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfilePhotoChange}
                    disabled={uploading}
                  />
                </motion.label>
              </>
            )}
          </motion.div>
          <div className="profile-info">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {profileData.username}
            </motion.h1>
            <motion.p 
              className="profile-level"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {profileData.year || 'Student'}
            </motion.p>
          </div>
          <motion.button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </motion.div>

        <motion.div 
          className="profile-stats"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="stat-card fancy-gradient-card"
              variants={statVariants}
              whileHover="hover"
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="profile-sections"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="profile-section fancy-gradient-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              About Me
            </motion.h2>
            {isEditing ? (
              <motion.textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                className="bio-input"
                rows="4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              />
            ) : (
              <motion.p 
                className="bio-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {profileData.bio || 'No bio added yet.'}
              </motion.p>
            )}
          </motion.div>

          <motion.div 
            className="profile-section fancy-gradient-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Skills
            </motion.h2>
            <motion.div 
              className="skills-container"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {profileData.skills.map((skill, index) => (
                <motion.span 
                  key={index} 
                  className="skill-tag"
                  variants={tagVariants}
                  whileHover="hover"
                >
                  {skill}
                  {isEditing && (
                    <motion.button 
                      onClick={() => removeSkill(skill)}
                      className="remove-btn"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      ×
                    </motion.button>
                  )}
                </motion.span>
              ))}
            </motion.div>
            {isEditing && (
              <motion.div 
                className="add-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="add-input"
                />
                <motion.button 
                  onClick={addSkill} 
                  className="add-btn"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Add
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="profile-section fancy-gradient-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              Areas of Expertise
            </motion.h2>
            <motion.div 
              className="interests-container"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {profileData.expertise.map((item, index) => (
                <motion.span 
                  key={index} 
                  className="interest-tag"
                  variants={tagVariants}
                  whileHover="hover"
                >
                  {item}
                  {isEditing && (
                    <motion.button 
                      onClick={() => removeExpertise(item)}
                      className="remove-btn"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      ×
                    </motion.button>
                  )}
                </motion.span>
              ))}
            </motion.div>
            {isEditing && (
              <motion.div 
                className="add-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add an area of expertise"
                  className="add-input"
                />
                <motion.button 
                  onClick={addExpertise} 
                  className="add-btn"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Add
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="profile-section fancy-gradient-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Academic Information
            </motion.h2>
            <div className="info-grid">
              <motion.div 
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
              >
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="info-input"
                  />
                ) : (
                  <span>{profileData.email || 'Not specified'}</span>
                )}
              </motion.div>
              <motion.div 
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.35 }}
              >
                <label>Mobile Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.mobileNumber}
                    onChange={(e) => setProfileData({...profileData, mobileNumber: e.target.value})}
                    placeholder="Enter your mobile number"
                    className="info-input"
                  />
                ) : (
                  <span>{profileData.mobileNumber || 'Not specified'}</span>
                )}
              </motion.div>
              <motion.div 
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
              >
                <label>Year of Study</label>
                {isEditing ? (
                  <select
                    value={profileData.year}
                    onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                    className="info-input"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                ) : (
                  <span>{profileData.year || 'Not specified'}</span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isEditing && (
            <motion.div 
              className="save-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button 
                onClick={handleSave} 
                className="save-btn"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Save Changes
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {weeklyDoubts && weeklyDoubts.length > 0 ? (
          <motion.div 
            className="profile-graph-section" 
            style={{ width: '100%', maxWidth: 900, margin: '2rem auto 0', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '2rem 1rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.h2 
              style={{ textAlign: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              Doubts Asked This Week
            </motion.h2>
            <motion.div 
              style={{ textAlign: 'center', marginBottom: '1rem', color: '#a78bfa' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              Total doubts this week: {weeklyDoubts.reduce((sum, day) => sum + (day.count || 0), 0)}
            </motion.div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyDoubts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }} 
                />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                  }}
                  formatter={(value) => [value, 'Doubts']}
                />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <motion.div 
            className="profile-graph-section" 
            style={{ width: '100%', maxWidth: 900, margin: '2rem auto 0', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '2rem 1rem', textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.h2 
              style={{ textAlign: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              Doubts Asked This Week
            </motion.h2>
            <motion.p 
              style={{ color: '#a78bfa', fontSize: '1.1rem' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              No doubts asked this week. Start asking questions to see your activity here!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile; 