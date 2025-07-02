import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Collaboration.css';
import NavigationBar from './components/NavigationBar.jsx';
import AdvancedFooter from './components/AdvancedFooter.jsx';

const projects = [
  {
    id: 1,
    title: "E-Learning Platform",
    description: "Building a modern e-learning platform with React and Node.js",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    members: [
      { user: { username: "Alice" } },
      { user: { username: "Bob" } },
      { user: { username: "Charlie" } }
    ],
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
    members: [
      { user: { username: "Ananya" } },
      { user: { username: "Rahul" } }
    ],
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
    members: [
      { user: { username: "Rohit" } },
      { user: { username: "Neha" } },
      { user: { username: "Vikram" } },
      { user: { username: "Priya" } }
    ],
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
    members: [
      { user: { username: "Priya" } }
    ],
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
    category: '',
    difficulty: 'Intermediate',
    duration: '3 months',
    mentor: currentUser?.name || 'You'
  });
  const [allProjects, setAllProjects] = useState([]);
  const navigate = useNavigate();

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

  const modalVariants = {
    initial: { opacity: 0, scale: 0.8, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Fetch all projects from backend
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/collaboration', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllProjects(response.data.collaborations);
        // Only show projects where the creator is the current user
        const myProjects = response.data.collaborations.filter(
          (proj) => proj.creator && (proj.creator._id === currentUser?._id)
        );
        setUserProjects(myProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    if (currentUser?._id) fetchAllProjects();
  }, [currentUser]);

  // Join project logic
  const handleJoinProject = async (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const confirmJoin = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/collaboration/${selectedProject._id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setSelectedProject(null);
      // Refetch all projects to update members
      const response = await axios.get('http://localhost:5000/api/collaboration', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllProjects(response.data.collaborations);
      const myProjects = response.data.collaborations.filter(
        (proj) => proj.creator && (proj.creator._id === currentUser?._id)
      );
      setUserProjects(myProjects);
      alert('Successfully joined the project!');
    } catch (error) {
      alert('Failed to join project.');
      setShowModal(false);
      setSelectedProject(null);
    }
  };

  const handleChatWithLeader = (project) => {
    // Navigate to chat with team leader
    alert(`Opening chat with ${project.mentor} for ${project.title}`);
  };

  const handleCreateProject = () => {
    setShowCreateForm(true);
  };

  // Persist project to backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category || 'General',
        skills: formData.skills,
        maxMembers: formData.maxMembers
      };
      const response = await axios.post('http://localhost:5000/api/collaboration', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.collaboration) {
        setUserProjects((prev) => [response.data.collaboration, ...prev]);
        setFormData({
          title: '',
          description: '',
          skills: '',
          maxMembers: 5,
          category: '',
          difficulty: 'Intermediate',
          duration: '3 months',
          mentor: currentUser?.name || 'You'
        });
        setShowCreateForm(false);
        alert('Project created successfully!');
      }
    } catch (error) {
      alert('Failed to create project.');
      console.error('Error creating project:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Combine backend and dummy projects, remove duplicates by title
  const combinedProjects = [...(allProjects || []), ...projects].filter((proj, idx, arr) =>
    arr.findIndex(p => (p.title || '').toLowerCase() === (proj.title || '').toLowerCase()) === idx
  );
  const availableProjects = combinedProjects.filter(
    (proj) => (proj.members?.length || 1) < (proj.maxMembers || 5)
  );
  const fullProjects = allProjects.filter(
    (proj) => (proj.members?.length || 1) >= (proj.maxMembers || 5)
  );

  // Dummy full projects
  const dummyFullProjects = [
    {
      id: 101,
      title: "Quantum Computing Research",
      description: "A research group exploring quantum algorithms and hardware.",
      skills: ["Quantum Mechanics", "Python", "Qiskit"],
      members: [
        { user: { username: "Dr. Qubit" } },
        { user: { username: "Alice" } },
        { user: { username: "Bob" } },
        { user: { username: "Charlie" } }
      ],
      maxMembers: 4,
      difficulty: "Advanced",
      duration: "6 months",
      mentor: "Dr. Qubit",
      status: "Active"
    },
    {
      id: 102,
      title: "Robotics Competition Team",
      description: "Building and programming robots for national competitions.",
      skills: ["Robotics", "C++", "Electronics"],
      members: [
        { user: { username: "RoboLead" } },
        { user: { username: "Neha" } },
        { user: { username: "Vikram" } },
        { user: { username: "Priya" } },
        { user: { username: "Rohit" } }
      ],
      maxMembers: 5,
      difficulty: "Intermediate",
      duration: "4 months",
      mentor: "RoboLead",
      status: "Active"
    }
  ];

  // Full projects: combine backend and dummy, remove duplicates
  const combinedFullProjects = [...(allProjects || []), ...dummyFullProjects].filter((proj, idx, arr) =>
    arr.findIndex(p => (p.title || '').toLowerCase() === (proj.title || '').toLowerCase()) === idx
  ).filter(
    (proj) => (proj.members?.length || 1) >= (proj.maxMembers || 5)
  );

  const handleProjectGroupChat = async (project) => {
    const token = localStorage.getItem('token');
    const memberIds = project.members.map(m => m.user?._id || m.user?.id || m.user);
    const groupName = project.title;
    const roomId = `project_${project._id || project.id}`;

    try {
      // Try to create the group (if it already exists, backend should handle duplicate roomId)
      const response = await axios.post('http://localhost:5000/api/groups', {
        groupName,
        members: memberIds,
        roomId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Redirect to chat page with the group roomId
      navigate(`/chat/${response.data.roomId}`);
    } catch (error) {
      alert('Failed to open group chat: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <motion.div 
      className="collaboration-container"
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

      <motion.div 
        className="collaboration-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.div 
          className="collaboration-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            🤝 Project Collaboration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Join exciting projects and build amazing things together
          </motion.p>
        </motion.div>

        {/* User's Projects Section */}
        <AnimatePresence>
        {userProjects.length > 0 && (
            <motion.div 
              className="user-projects-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                🎯 Your Projects
              </motion.h2>
              <motion.div 
                className="projects-grid"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {userProjects.map((project, index) => (
                  <motion.div 
                    key={project._id || project.id} 
                    className="project-card user-project"
                    variants={cardVariants}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div 
                      className="project-header"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                    <h3>{project.title}</h3>
                    <span className={`difficulty ${(project.difficulty || 'Intermediate').toLowerCase()}`}>
                      {project.difficulty || 'Intermediate'}
                    </span>
                    </motion.div>
                    <motion.p 
                      className="project-description"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                    >
                      {project.description}
                    </motion.p>
                    <motion.div 
                      className="project-skills"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                    >
                      {(project.skills || []).map((skill, skillIndex) => (
                        <motion.span 
                          key={skillIndex} 
                          className="skill-tag"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.1 + skillIndex * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </motion.div>
                    <motion.div 
                      className="project-meta"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                    >
                    <div className="meta-item">
                      <span>👥 {project.members?.length || 1}/{project.maxMembers || 5} Members</span>
                    </div>
                    <div className="meta-item">
                      <span>⏱️ {project.duration || '3 months'}</span>
                    </div>
                    <div className="meta-item">
                      <span>👨‍🏫 {project.mentor || (project.creator?.username || 'N/A')}</span>
                    </div>
                    </motion.div>
                    <motion.div 
                      className="project-members"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                    >
                    <strong>Members:</strong> {(project.members || []).map((m, idx) => m.user?.username || m.user?.name || 'Unknown').join(', ')}
                    </motion.div>
                    <motion.div 
                      className="project-actions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                    >
                      <motion.button 
                        className="manage-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Manage Project
                      </motion.button>
                      <motion.button 
                        className="chat-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        💬
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available Projects Section */}
        <motion.div 
          className="available-projects-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            🚀 Available Projects
          </motion.h2>
          <motion.div 
            className="projects-grid"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {availableProjects.map((project, index) => (
              <motion.div 
                key={project._id || project.id} 
                className="project-card"
                variants={cardVariants}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className="project-header"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                >
                  <h3>{project.title}</h3>
                  <span className={`difficulty ${(project.difficulty || 'Intermediate').toLowerCase()}`}>
                    {project.difficulty || 'Intermediate'}
                  </span>
                </motion.div>
                <motion.p 
                  className="project-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  {project.description}
                </motion.p>
                <motion.div 
                  className="project-skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  {(project.skills || []).map((skill, skillIndex) => (
                    <motion.span 
                      key={skillIndex} 
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.div 
                  className="project-meta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  <div className="meta-item">
                    <span>👥 {project.members?.length || 1}/{project.maxMembers || 5} Members</span>
                  </div>
                  <div className="meta-item">
                    <span>⏱️ {project.duration || '3 months'}</span>
                  </div>
                  <div className="meta-item">
                    <span>👨‍🏫 {project.mentor || (project.creator?.username || 'N/A')}</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="project-members"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  <strong>Members:</strong> {(project.members || []).map((m, idx) => m.user?.username || m.user?.name || 'Unknown').join(', ')}
                </motion.div>
                <motion.div 
                  className="project-actions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                >
                  {(!project.members || !project.members.some(m => m.user?._id === currentUser?._id)) &&
                    (project.members?.length || 1) < (project.maxMembers || 5) && (
                    <motion.button 
                      className="join-btn" 
                      onClick={() => handleJoinProject(project)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Join Project
                    </motion.button>
                  )}
                  <motion.button 
                    className="chat-btn" 
                    onClick={() => handleProjectGroupChat(project)} 
                    title={`Group Chat for ${project.title}`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    💬
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Create Project Section */}
        <motion.div 
          className="create-project-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            Have a project idea?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Create your own project and invite others to collaborate
          </motion.p>
          <motion.button 
            className="create-btn" 
            onClick={handleCreateProject}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 1.3 }}
          >
            Create New Project
          </motion.button>
        </motion.div>

        {/* Full Projects Section */}
        <motion.div 
          className="full-projects-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <motion.h2 
            style={{
            color: '#c4b5fd',
            fontSize: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
            paddingTop: '2rem',
            paddingBottom: '1.5rem'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Join Fast! The Projects Already Full
          </motion.h2>
          <motion.div 
            className="projects-grid"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {combinedFullProjects.map((project, index) => (
              <motion.div 
                key={project._id || project.id} 
                className="project-card full-project"
                variants={cardVariants}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className="project-header"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <h3>{project.title}</h3>
                  <span className={`difficulty ${(project.difficulty || 'Intermediate').toLowerCase()}`}>
                    {project.difficulty || 'Intermediate'}
                  </span>
                </motion.div>
                <motion.p 
                  className="project-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  {project.description}
                </motion.p>
                <motion.div 
                  className="project-skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  {(project.skills || []).map((skill, skillIndex) => (
                    <motion.span 
                      key={skillIndex} 
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.6 + index * 0.1 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.div 
                  className="project-meta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 + index * 0.1 }}
                >
                  <div className="meta-item">
                    <span>👥 {project.members?.length || 1}/{project.maxMembers || 5} Members</span>
                  </div>
                  <div className="meta-item">
                    <span>⏱️ {project.duration || '3 months'}</span>
                  </div>
                  <div className="meta-item">
                    <span>👨‍🏫 {project.mentor || (project.creator?.username || 'N/A')}</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="project-members"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 + index * 0.1 }}
                >
                  <strong>Members:</strong> {(project.members || []).map((m, idx) => m.user?.username || m.user?.name || 'Unknown').join(', ')}
                </motion.div>
                <motion.div 
                  className="project-actions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9 + index * 0.1 }}
                >
                  <motion.button 
                    className="chat-btn" 
                    onClick={() => handleProjectGroupChat(project)} 
                    title={`Group Chat for ${project.title}`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    💬
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Join Project Modal */}
      <AnimatePresence>
      {showModal && selectedProject && (
          <motion.div 
            className="modal-overlay" 
            onClick={() => setShowModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.button 
                className="close-btn" 
                onClick={() => setShowModal(false)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
              &times;
              </motion.button>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Join {selectedProject.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <strong>Description:</strong> {selectedProject.description}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <strong>Skills Required:</strong> {(selectedProject.skills || []).join(', ')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <strong>Duration:</strong> {selectedProject.duration || '3 months'}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <strong>Mentor:</strong> {selectedProject.mentor || (selectedProject.creator?.username || 'N/A')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <strong>Team Size:</strong> {selectedProject.members?.length || 1}/{selectedProject.maxMembers || 5}
              </motion.p>
              <motion.div 
                className="modal-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button 
                  onClick={() => setShowModal(false)} 
                  className="cancel-btn"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                Cancel
                </motion.button>
              {(!selectedProject.members || !selectedProject.members.some(m => m.user?._id === currentUser?._id)) &&
                (selectedProject.members?.length || 1) < (selectedProject.maxMembers || 5) && (
                  <motion.button 
                    onClick={confirmJoin} 
                    className="confirm-btn"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                  Join Project
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Project Form Modal */}
      <AnimatePresence>
      {showCreateForm && (
          <motion.div 
            className="modal-overlay" 
            onClick={() => setShowCreateForm(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content create-form" 
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.button 
                className="close-btn" 
                onClick={() => setShowCreateForm(false)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
              &times;
              </motion.button>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Create New Project
              </motion.h2>
              <motion.form 
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                <label>Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter project title"
                />
                </motion.div>
                
                <motion.div 
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your project"
                  rows="3"
                />
                </motion.div>
                
                <motion.div 
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                <label>Skills Required (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                  placeholder="React, Node.js, MongoDB"
                />
                </motion.div>
                
                <motion.div 
                  className="form-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
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
                  </motion.div>
                  
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
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
                  </motion.div>
                  
                  <motion.div 
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
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
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="modal-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <motion.button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)} 
                    className="cancel-btn"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                  Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="confirm-btn"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                  Create Project
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Advanced Footer */}
      <AdvancedFooter />
    </motion.div>
  );
};

export default Collaboration; 