import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = ({ currentUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'John Doe',
    email: currentUser?.email || 'john@example.com',
    bio: 'Passionate learner and tech enthusiast. Always eager to help others and learn new things.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    location: 'Mumbai, India',
    education: 'B.Tech Computer Science',
    experience: '2 years',
    interests: ['Web Development', 'Open Source', 'Machine Learning']
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    alert('Profile updated successfully!');
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

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const stats = [
    { label: 'Questions Answered', value: 45 },
    { label: 'Projects Completed', value: 12 },
    { label: 'Mentorship Sessions', value: 8 },
    { label: 'Days Active', value: 156 }
  ];

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/mentorship">Mentorship</Link>
          <Link to="/collaboration">Collaboration</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/profile" className="active">Profile</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">{profileData.name.charAt(0)}</span>
          </div>
          <div className="profile-info">
            <h1>{profileData.name}</h1>
            <p className="profile-level">{currentUser?.level || 'Student'}</p>
            <p className="profile-email">{profileData.email}</p>
          </div>
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h2>About Me</h2>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                className="bio-input"
                rows="4"
              />
            ) : (
              <p className="bio-text">{profileData.bio}</p>
            )}
          </div>

          <div className="profile-section">
            <h2>Skills</h2>
            <div className="skills-container">
              {profileData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  {isEditing && (
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="add-item">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="add-input"
                />
                <button onClick={addSkill} className="add-btn">Add</button>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>Interests</h2>
            <div className="interests-container">
              {profileData.interests.map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest}
                  {isEditing && (
                    <button 
                      onClick={() => removeInterest(interest)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="add-item">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                  className="add-input"
                />
                <button onClick={addInterest} className="add-btn">Add</button>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="info-input"
                  />
                ) : (
                  <span>{profileData.location}</span>
                )}
              </div>
              <div className="info-item">
                <label>Education</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.education}
                    onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                    className="info-input"
                  />
                ) : (
                  <span>{profileData.education}</span>
                )}
              </div>
              <div className="info-item">
                <label>Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                    className="info-input"
                  />
                ) : (
                  <span>{profileData.experience}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="save-section">
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 