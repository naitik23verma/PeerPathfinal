import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Collaboration.css';

const projects = [
  {
    id: 1,
    title: "E-Learning Platform",
    description: "Building a modern e-learning platform with React and Node.js",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    members: 3,
    maxMembers: 5,
    difficulty: "Intermediate",
    duration: "3 months",
    mentor: "Satyam Sharma",
    status: "Active"
  },
  {
    id: 2,
    title: "AI Chat Assistant",
    description: "Creating an intelligent chatbot using Python and TensorFlow",
    skills: ["Python", "TensorFlow", "NLP", "Flask"],
    members: 2,
    maxMembers: 4,
    difficulty: "Advanced",
    duration: "4 months",
    mentor: "Ananya Jain",
    status: "Active"
  },
  {
    id: 3,
    title: "Mobile Fitness App",
    description: "Cross-platform fitness tracking app with React Native",
    skills: ["React Native", "Firebase", "Redux", "TypeScript"],
    members: 4,
    maxMembers: 6,
    difficulty: "Intermediate",
    duration: "5 months",
    mentor: "Rohit Yadav",
    status: "Active"
  },
  {
    id: 4,
    title: "Blockchain Voting System",
    description: "Secure voting system using blockchain technology",
    skills: ["Solidity", "Web3.js", "React", "Node.js"],
    members: 1,
    maxMembers: 3,
    difficulty: "Advanced",
    duration: "6 months",
    mentor: "Priya Singh",
    status: "Active"
  }
];

const Collaboration = ({ currentUser, onLogout }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    maxMembers: 5,
    difficulty: 'Intermediate',
    duration: '3 months',
    mentor: currentUser?.name || 'You'
  });

  const handleJoinProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const confirmJoin = () => {
    // Simulate joining project
    alert(`Successfully joined ${selectedProject.title}!`);
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleChatWithLeader = (project) => {
    // Navigate to chat with team leader
    alert(`Opening chat with ${project.mentor} for ${project.title}`);
  };

  const handleCreateProject = () => {
    setShowCreateForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: Date.now(),
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      members: 1,
      status: "Active",
      createdBy: currentUser?.name || 'You'
    };

    setUserProjects([...userProjects, newProject]);
    setFormData({
      title: '',
      description: '',
      skills: '',
      maxMembers: 5,
      difficulty: 'Intermediate',
      duration: '3 months',
      mentor: currentUser?.name || 'You'
    });
    setShowCreateForm(false);
    alert('Project created successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="collaboration-container">
      <nav className="collaboration-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/mentorship">Mentorship</Link>
          <Link to="/collaboration" className="active">Collaboration</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="collaboration-content">
        <div className="collaboration-header">
          <h1>🤝 Project Collaboration</h1>
          <p>Join exciting projects and build amazing things together</p>
        </div>

        {/* User's Projects Section */}
        {userProjects.length > 0 && (
          <div className="user-projects-section">
            <h2>🎯 Your Projects</h2>
            <div className="projects-grid">
              {userProjects.map((project) => (
                <div key={project.id} className="project-card user-project">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className={`difficulty ${project.difficulty.toLowerCase()}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-skills">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="project-meta">
                    <div className="meta-item">
                      <span>👥 {project.members}/{project.maxMembers} Members</span>
                    </div>
                    <div className="meta-item">
                      <span>⏱️ {project.duration}</span>
                    </div>
                    <div className="meta-item">
                      <span>👨‍🏫 {project.mentor}</span>
                    </div>
                  </div>
                  
                  <div className="project-actions">
                    <button className="manage-btn">
                      Manage Project
                    </button>
                    <button className="chat-btn">
                      💬
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Projects Section */}
        <div className="available-projects-section">
          <h2>🚀 Available Projects</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`difficulty ${project.difficulty.toLowerCase()}`}>
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-skills">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                
                <div className="project-meta">
                  <div className="meta-item">
                    <span>👥 {project.members}/{project.maxMembers} Members</span>
                  </div>
                  <div className="meta-item">
                    <span>⏱️ {project.duration}</span>
                  </div>
                  <div className="meta-item">
                    <span>👨‍🏫 {project.mentor}</span>
                  </div>
                </div>
                
                <div className="project-actions">
                  <button 
                    className="join-btn"
                    onClick={() => handleJoinProject(project)}
                    disabled={project.members >= project.maxMembers}
                  >
                    {project.members >= project.maxMembers ? 'Full' : 'Join Project'}
                  </button>
                  <button 
                    className="chat-btn"
                    onClick={() => handleChatWithLeader(project)}
                    title={`Chat with ${project.mentor}`}
                  >
                    💬
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="create-project-section">
          <h2>Have a project idea?</h2>
          <p>Create your own project and invite others to collaborate</p>
          <button className="create-btn" onClick={handleCreateProject}>Create New Project</button>
        </div>
      </div>

      {/* Join Project Modal */}
      {showModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2>Join {selectedProject.title}</h2>
            <p><strong>Description:</strong> {selectedProject.description}</p>
            <p><strong>Skills Required:</strong> {selectedProject.skills.join(', ')}</p>
            <p><strong>Duration:</strong> {selectedProject.duration}</p>
            <p><strong>Mentor:</strong> {selectedProject.mentor}</p>
            <p><strong>Team Size:</strong> {selectedProject.members}/{selectedProject.maxMembers}</p>
            
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmJoin} className="confirm-btn">
                Join Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Form Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content create-form" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowCreateForm(false)}>
              &times;
            </button>
            <h2>Create New Project</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter project title"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your project"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Skills Required (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Max Team Size</label>
                  <select
                    name="maxMembers"
                    value={formData.maxMembers}
                    onChange={handleInputChange}
                  >
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={8}>8</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  >
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="4 months">4 months</option>
                    <option value="5 months">5 months</option>
                    <option value="6 months">6 months</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration; 