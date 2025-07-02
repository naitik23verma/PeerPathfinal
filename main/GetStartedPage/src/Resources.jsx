import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Resources.css';
import NavigationBar from './components/NavigationBar.jsx';
import AdvancedFooter from './components/AdvancedFooter.jsx';

const Resources = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('study-materials');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    category: 'general',
    tags: ''
  });

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

  const studyMaterials = [
    {
      id: 1,
      title: "NITB Freshers Portal",
      description: "Complete collection of 1st year notes, assignments, and study materials",
      link: "https://nitbfreshers.42web.io/?i=1",
      type: "Website",
      icon: "🌐"
    },
    {
      id: 3,
      title: "MANIT Study Portal App",
      description: "Android app for downloading class notes, assignments, and previous year papers",
      link: "https://manitfirst.web.app/download",
      type: "Android App",
      icon: "📱"
    }
  ];

  const societies = {
    technical: [
      {
        id: 'sae',
        title: 'SAE MANIT',
        description: 'The Society of Automotive Engineers\' student chapter focused on mobility engineering, vehicle fabrication (e.g., Baja, Supra), and hosting auto-tech events.',
        link: 'https://www.manit.ac.in/content/sae-collegiate-club',
        type: 'Technical',
        logo: '/sae-logo.svg'
      },
      {
        id: 'ecell',
        title: 'E-Cell MANIT',
        description: 'Encourages entrepreneurship via mentorship programs, startup support, pitch events, and ideation workshops.',
        link: 'https://www.ecellnitb.in/?view=about',
        type: 'Technical',
        logo: '/ecell-logo.svg'
      },
      {
        id: 'robotics',
        title: 'Robotics Club',
        description: 'Builds technical expertise through hands-on robotics projects, competitions, and learning sessions.',
        link: 'https://www.instagram.com/roboticsclubmanit/',
        type: 'Technical',
        logo: '/robotics-logo.svg'
      },
      {
        id: 'iste',
        title: 'ISTE MANIT',
        description: 'Enhances technical knowledge with seminars, workshops, and collaborations with industry professionals.',
        link: 'https://www.istemanit.in/',
        type: 'Technical',
        logo: '/iste-logo.svg'
      },
      {
        id: 'ieee',
        title: 'IEEE MANIT',
        description: 'Promotes learning in electronics, computing, and emerging tech, conducting technical events and hackathons.',
        link: 'https://ieeenitb.com/',
        type: 'Technical',
        logo: '/ieee-logo.svg'
      },
      {
        id: 'zenith',
        title: 'Zenith (Programming Club)',
        description: 'Conducts DSA classes, contests, and placement prep, aiming to improve coding proficiency and problem-solving skills.',
        link: 'https://www.facebook.com/zenith.manit',
        type: 'Technical',
        logo: '/zenith-logo.svg'
      },
      {
        id: 'evolve',
        title: 'Evolve',
        description: 'Interdisciplinary technical club conducting EV design workshops, power electronics and ML projects, and practical prototyping across domains.',
        link: 'https://www.instagram.com/evolve_nitb/',
        type: 'Technical',
        logo: '/evolve-logo.svg'
      }
    ],
    cultural: [
      {
        id: 'roobaroo',
        title: 'Roobaroo',
        description: 'Celebrates artistic expression via music, dance, drama, and anchoring — a creative platform for all talents.',
        link: 'https://www.manit.ac.in/content/roobaroo',
        type: 'Cultural',
        logo: '/roobaroo-logo.svg'
      },
      {
        id: 'aeseanek',
        title: 'AE SE ANEK',
        description: 'Promotes diversity and inclusion through culturally rich fests, inter-branch performances, and theme-based creative showcases.',
        link: 'https://www.manit.ac.in/content/%E0%A4%90-%E0%A4%B8%E0%A5%87-%E0%A4%90%E0%A4%A8%E0%A4%95',
        type: 'Cultural',
        logo: '/aeseanek-logo.svg'
      },
      {
        id: 'spicmacay',
        title: 'SPIC MACAY',
        description: 'Aims to preserve Indian heritage through classical music concerts, cultural awareness events, and arts appreciation.',
        link: 'https://www.manit.ac.in/content/spic-macay',
        type: 'Cultural',
        logo: '/spicmacay-logo.svg'
      }
    ],
    educational: [
      {
        id: 'avantikulam',
        title: 'Avantikulam',
        description: 'A social initiative providing free education and mentoring to underprivileged students preparing for JEE, NEET, NTSE, etc.',
        link: 'https://www.instagram.com/_nitb_avantikulam_/',
        type: 'Educational Outreach',
        logo: '/avantikulam-logo.svg'
      },
      {
        id: 'quizzers',
        title: 'Quizzer\'s Club',
        description: 'Hosts quizzes on diverse topics, encouraging learning through competition and curiosity.',
        link: 'https://www.quizzersclub.in/',
        type: 'Educational',
        logo: '/quizzers-logo.svg'
      }
    ],
    sportsAndHobby: [
        {
            id: 'purge',
            title: 'Purge',
            description: 'Drives eco-awareness campaigns, cleanups, and sustainability initiatives on campus.',
            link: 'https://www.instagram.com/purge_manit/',
            type: 'Environmental',
            logo: '/purge-logo.svg'
        },
        {
            id: 'pixel',
            title: 'Pixel',
            description: 'For enthusiasts of visual media, photography, and video editing — covers both technical and creative angles.',
            link: 'https://www.instagram.com/pixel.manit/',
            type: 'Hobby',
            logo: '/pixel-logo.svg'
        }
    ]
  };

  const results = [
    {
      id: 1,
      title: "Semester Results",
      description: "Check your semester examination results, grades, and academic performance",
      link: "https://students.manit.ac.in/result",
      type: "Academic Results",
      icon: "📋"
    },
    {
      id: 2,
      title: "Marks & Grades",
      description: "View detailed marks, grade points, and cumulative performance analysis",
      link: "https://iamwsumit.github.io/manit-result/",
      type: "Marks",
      icon: "📊"
    },
    {
      id: 3,
      title: "Latest News & Updates",
      description: "Stay updated with the latest academic announcements, events, and important notices",
      link: "https://manit.ac.in/news",
      type: "News",
      icon: "📰"
    }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleResourceClick = (resource) => {
    if (resource.link && resource.link !== '#') {
      window.open(resource.link, '_blank');
    }
  };

  const renderContent = () => {
    if (activeTab === 'study-materials') {
      return (
        <motion.div 
          className="resources-grid"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {studyMaterials.map((resource, index) => (
            <motion.div 
              key={resource.id} 
              className="resource-card" 
              onClick={() => handleResourceClick(resource)}
              variants={cardVariants}
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <motion.div 
                className="resource-icon"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {resource.icon}
              </motion.div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-type">{resource.type}</p>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-action">
                <motion.button 
                  className="access-btn"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Access
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    if (activeTab === 'society-recruitment') {
      return (
        <>
          <motion.div 
            className="society-category"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.h2 
              className="society-category-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              🛠 Technical Societies
            </motion.h2>
            <motion.div 
              className="resources-grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {societies.technical.map((society, index) => (
                <motion.div 
                  key={society.id} 
                  className="resource-card"
                  variants={cardVariants}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className="resource-logo"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={society.logo} 
                      alt={`${society.title} logo`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="fallback-icon" style={{display: 'none'}}>
                      {society.title === 'SAE MANIT' ? '🏎️' :
                       society.title === 'E-Cell MANIT' ? '💡' :
                       society.title === 'Robotics Club' ? '🤖' :
                       society.title === 'ISTE MANIT' ? '🎓' :
                       society.title === 'IEEE MANIT' ? '💡' :
                       society.title === 'Zenith (Programming Club)' ? '💻' :
                       society.title === 'Evolve' ? '⚡' : '🏛️'}
                    </span>
                  </motion.div>
                  <h3 className="resource-title">{society.title}</h3>
                  <p className="resource-description">{society.description}</p>
                  <div className="resource-action">
                    <a href={society.link} target="_blank" rel="noopener noreferrer">
                      <motion.button 
                        className="access-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Visit Page
                      </motion.button>
                    </a>
                    <motion.button 
                      className="recruitment-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Recruitment Coming Soon
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="society-category"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h2 
              className="society-category-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              🎭 Cultural & Literary Societies
            </motion.h2>
            <motion.div 
              className="resources-grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {societies.cultural.map((society, index) => (
                <motion.div 
                  key={society.id} 
                  className="resource-card"
                  variants={cardVariants}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className="resource-logo"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={society.logo} 
                      alt={`${society.title} logo`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="fallback-icon" style={{display: 'none'}}>
                      {society.title === 'Roobaroo' ? '🎨' :
                       society.title === 'AE SE ANEK' ? '🏛️' :
                       society.title === 'SPIC MACAY' ? '🎶' : '🎨'}
                    </span>
                  </motion.div>
                  <h3 className="resource-title">{society.title}</h3>
                  <p className="resource-description">{society.description}</p>
                  <div className="resource-action">
                    <a href={society.link} target="_blank" rel="noopener noreferrer">
                      <motion.button 
                        className="access-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Visit Page
                      </motion.button>
                    </a>
                    <motion.button 
                      className="recruitment-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Recruitment Coming Soon
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="society-category"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h2 
              className="society-category-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              📚 Educational Outreach
            </motion.h2>
            <motion.div 
              className="resources-grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {societies.educational.map((society, index) => (
                <motion.div 
                  key={society.id} 
                  className="resource-card"
                  variants={cardVariants}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className="resource-logo"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={society.logo} 
                      alt={`${society.title} logo`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="fallback-icon" style={{display: 'none'}}>
                      {society.title === 'Avantikulam' ? '📚' :
                       society.title === 'Quizzer\'s Club' ? '❓' : '📚'}
                    </span>
                  </motion.div>
                  <h3 className="resource-title">{society.title}</h3>
                  <p className="resource-description">{society.description}</p>
                  <div className="resource-action">
                    <a href={society.link} target="_blank" rel="noopener noreferrer">
                      <motion.button 
                        className="access-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Visit Page
                      </motion.button>
                    </a>
                    <motion.button 
                      className="recruitment-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Recruitment Coming Soon
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="society-category"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.h2 
              className="society-category-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              🌱 Environment, Sports & Hobby Clubs
            </motion.h2>
            <motion.div 
              className="resources-grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {societies.sportsAndHobby.map((society, index) => (
                <motion.div 
                  key={society.id} 
                  className="resource-card"
                  variants={cardVariants}
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className="resource-logo"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={society.logo} 
                      alt={`${society.title} logo`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="fallback-icon" style={{display: 'none'}}>
                      {society.title === 'Purge' ? '🌿' :
                       society.title === 'Pixel' ? '📷' : '🏆'}
                    </span>
                  </motion.div>
                  <h3 className="resource-title">{society.title}</h3>
                  <p className="resource-description">{society.description}</p>
                  <div className="resource-action">
                    <a href={society.link} target="_blank" rel="noopener noreferrer">
                      <motion.button 
                        className="access-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Visit Page
                      </motion.button>
                    </a>
                    <motion.button 
                      className="recruitment-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Recruitment Coming Soon
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </>
      );
    }

    if (activeTab === 'results') {
      return (
        <motion.div 
          className="resources-grid"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {results.map((resource, index) => (
            <motion.div 
              key={resource.id} 
              className="resource-card"
              variants={cardVariants}
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <motion.div 
                className="resource-icon"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {resource.icon}
              </motion.div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-action single-button">
                {resource.id === 2 ? (
                  <a href="https://iamwsumit.github.io/manit-result/" target="_blank" rel="noopener noreferrer">
                    <motion.button 
                      className="access-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Access Portal
                    </motion.button>
                  </a>
                ) : (
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    <motion.button 
                      className="access-btn"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Access Portal
                    </motion.button>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="resources-page"
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

      <motion.main 
        className="resources-main"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.header 
          className="resources-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            University Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your central hub for academic materials, society information, and official updates.
          </motion.p>
        </motion.header>

        <motion.div 
          className="category-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button 
            onClick={() => handleTabClick('study-materials')} 
            className={`category-tab ${activeTab === 'study-materials' ? 'active' : ''}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 0.8 }}
          >
            📚 Study Materials
          </motion.button>
          <motion.button 
            onClick={() => handleTabClick('society-recruitment')} 
            className={`category-tab ${activeTab === 'society-recruitment' ? 'active' : ''}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 0.9 }}
          >
            🏛️ Society Recruitment
          </motion.button>
          <motion.button 
            onClick={() => handleTabClick('results')} 
            className={`category-tab ${activeTab === 'results' ? 'active' : ''}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 1.0 }}
          >
            📊 Results & Updates
          </motion.button>
        </motion.div>

        <motion.div 
          className="resources-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.main>
      
      {/* Advanced Footer */}
      <AdvancedFooter />
    </motion.div>
  );
};

export default Resources;