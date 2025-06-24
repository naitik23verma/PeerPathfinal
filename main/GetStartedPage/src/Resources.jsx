import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Resources.css';

const Resources = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('study-materials');

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
      id: 2,
      title: "Google Drive Study Materials",
      description: "Comprehensive drive containing all 1st year notes and resources",
      link: "https://drive.google.com/drive/folders/1xKRoLEPgIytHXwwpbhOFalefSSenhDnm?usp=sharing",
      type: "Drive Link",
      icon: "📁"
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
        description: 'Promotes extensive engineering, designing and fabrication dedicated to create innovative solutions and advanced technologies in the field of automobiles.',
        link: 'https://www.sae.org/',
        type: 'Technical',
        logo: '/sae-logo.svg'
      },
      {
        id: 'ecell',
        title: 'E-Cell MANIT',
        description: 'The Entrepreneurship Cell, fostering a startup culture through workshops, competitions, and E-Summit.',
        link: 'https://www.ecellmanit.in/',
        type: 'Technical',
        logo: '/ecell-logo.svg'
      },
      {
        id: 'esseract',
        title: 'Tesseract',
        description: 'The official coding club of MANIT, focused on competitive programming, development, and machine learning.',
        link: 'https://github.com/tesseractcoding',
        type: 'Technical',
        logo: '/tesseract-logo.svg'
      },
      {
        id: 'robotics',
        title: 'Robotics Club MANIT',
        description: 'Dedicated to robotics, automation, and mechatronics, participating in various national events.',
        link: 'https://www.instagram.com/roboticsclubmanit/',
        type: 'Technical',
        logo: '/robotics-logo.svg'
      },
      {
        id: 'iste',
        title: 'ISTE MANIT',
        description: 'The Indian Society for Technical Education chapter, focusing on the professional development of students and faculty.',
        link: 'https://www.istemanit.in/',
        type: 'Technical',
        logo: '/iste-logo.svg'
      },
      {
        id: 'ieee',
        title: 'IEEE MANIT Student Branch',
        description: 'Advancing technology for humanity, this is the official IEEE student branch of MANIT Bhopal.',
        link: 'https://ieee.manit.ac.in/',
        type: 'Technical',
        logo: '/ieee-logo.svg'
      }
    ],
    cultural: [
      {
        id: 'roobaroo',
        title: 'Roobaroo',
        description: 'The cultural and literary hub of MANIT, responsible for organizing fests and cultural events.',
        link: 'https://www.facebook.com/roobaroo.manit',
        type: 'Cultural',
        logo: '/roobaroo-logo.svg'
      },
      {
        id: 'drishtant',
        title: 'Drishtant',
        description: 'The official dramatics society of MANIT, known for its nukkad nataks and stage plays.',
        link: 'https://drishtantmanit.wordpress.com/',
        type: 'Cultural',
        logo: '/drishtant-logo.svg'
      },
      {
        id: 'spicmacay',
        title: 'SPIC MACAY',
        description: 'Promotes Indian classical music, dance, and culture among youth through performances.',
        link: 'https://spicmacay.org/',
        type: 'Cultural',
        logo: '/spicmacay-logo.svg'
      },
      {
        id: 'avantikulam',
        title: 'Avantikulam',
        description: 'A cultural group promoting regional arts, literature, and traditions within the campus community.',
        link: 'https://www.instagram.com/avantikulam_manit/',
        type: 'Cultural',
        logo: '/avantikulam-logo.svg'
      }
    ],
    sportsAndHobby: [
        {
            id: 'zenith',
            title: 'Zenith Sports Club',
            description: 'The official sports club of MANIT, organizing various sporting events and promoting a healthy lifestyle.',
            link: 'https://www.facebook.com/zenith.manit',
            type: 'Sports',
            logo: '/zenith-logo.svg'
        },
        {
            id: 'pixel',
            title: 'Pixel Photography Club',
            description: 'The official photography and cinematography club of MANIT, for creative minds.',
            link: 'https://www.instagram.com/pixel.manit/',
            type: 'Hobby',
            logo: '/pixel-logo.svg'
        },
        {
            id: 'purge',
            title: 'Purge',
            description: 'An environmental society working on green initiatives and sustainable solutions.',
            link: 'https://www.instagram.com/purge_manit/',
            type: 'Environmental',
            logo: '/purge-logo.svg'
        },
        {
            id: 'quizzers',
            title: 'Quizzer\'s Club',
            description: 'The official quizzing club of MANIT, for enthusiasts of trivia, quizzes, and brain-teasers.',
            link: 'https://www.quizzersclubmanit.in/',
            type: 'Hobby',
            logo: '/quizzers-logo.svg'
        }
    ]
  };

  const results = [
    {
      id: 1,
      title: "Semester Results",
      description: "Check your semester examination results, grades, and academic performance",
      link: "https://manit.ac.in/results",
      type: "Academic Results",
      icon: "📋"
    },
    {
      id: 2,
      title: "Marks & Grades",
      description: "View detailed marks, grade points, and cumulative performance analysis",
      link: "https://manit.ac.in/marks",
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
        <div className="resources-grid">
          {studyMaterials.map((resource) => (
            <div key={resource.id} className="resource-card" onClick={() => handleResourceClick(resource)}>
              <div className="resource-icon">{resource.icon}</div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-type">{resource.type}</p>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-action">
                <button className="access-btn">Access</button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'society-recruitment') {
      return (
        <>
          <div className="society-category">
            <h2 className="society-category-title">⚙️ Technical Societies</h2>
            <div className="resources-grid">
              {societies.technical.map((society) => (
                <div key={society.id} className="resource-card">
                  <div className="resource-logo">
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
                       society.title === 'Tesseract' ? '💻' :
                       society.title === 'Robotics Club MANIT' ? '🤖' :
                       society.title === 'ISTE MANIT' ? '🎓' :
                       society.title === 'IEEE MANIT Student Branch' ? '💡' : '🏛️'}
                    </span>
                  </div>
                  <h3 className="resource-title">{society.title}</h3>
                  <p className="resource-description">{society.description}</p>
                  <div className="resource-action">
                    <a href={society.link} target="_blank" rel="noopener noreferrer">
                      <button className="access-btn">Visit Page</button>
                    </a>
                    <button className="recruitment-btn">Recruitment Coming Soon</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="society-category">
            <h2 className="society-category-title">🎨 Cultural Societies</h2>
            <div className="resources-grid">
              {societies.cultural.map((society) => (
                <div key={society.id} className="resource-card">
                  <div className="resource-logo">
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
                       society.title === 'Drishtant' ? '🎭' :
                       society.title === 'SPIC MACAY' ? '🎶' :
                       society.title === 'Avantikulam' ? '🏛️' : '🎨'}
                    </span>
                  </div>
                  <h3 className="resource-title">{society.title}</h3>
                  <p className="resource-description">{society.description}</p>
                  <div className="resource-action">
                    <a href={society.link} target="_blank" rel="noopener noreferrer">
                      <button className="access-btn">Visit Page</button>
                    </a>
                    <button className="recruitment-btn">Recruitment Coming Soon</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="society-category">
            <h2 className="society-category-title">🏅 Sports & Hobby Clubs</h2>
            <div className="resources-grid">
              {societies.sportsAndHobby.map((society) => (
                <div key={society.id} className="resource-card">
                  <div className="resource-logo">
                    <img 
                      src={society.logo} 
                      alt={`${society.title} logo`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="fallback-icon" style={{display: 'none'}}>
                      {society.title === 'Zenith Sports Club' ? '🏆' :
                       society.title === 'Pixel Photography Club' ? '📷' :
                       society.title === 'Purge' ? '🌿' :
                       society.title === 'Quizzer\'s Club' ? '❓' : '🏆'}
                    </span>
                  </div>
                  <h3 className="resource-title">{society.title}</h3>
                  <p className="resource-description">{society.description}</p>
                  <div className="resource-action">
                    <a href={society.link} target="_blank" rel="noopener noreferrer">
                      <button className="access-btn">Visit Page</button>
                    </a>
                    <button className="recruitment-btn">Recruitment Coming Soon</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (activeTab === 'results') {
      return (
        <div className="resources-grid">
          {results.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-icon">{resource.icon}</div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-action single-button">
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  <button className="access-btn">Access Portal</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="resources-page-container">
      <nav className="collaboration-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/doubts">Doubts</Link>
          <Link to="/collaboration">Collaboration</Link>
          <Link to="/resources" className="active">Resources</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/location">Location</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="resources-main">
        <header className="resources-header">
          <h1>University Resources</h1>
          <p>Your central hub for academic materials, society information, and official updates.</p>
        </header>

        <div className="category-tabs">
          <button onClick={() => handleTabClick('study-materials')} className={`category-tab ${activeTab === 'study-materials' ? 'active' : ''}`}>
            📚 Study Materials
          </button>
          <button onClick={() => handleTabClick('society-recruitment')} className={`category-tab ${activeTab === 'society-recruitment' ? 'active' : ''}`}>
            🏛️ Society Recruitment
          </button>
          <button onClick={() => handleTabClick('results')} className={`category-tab ${activeTab === 'results' ? 'active' : ''}`}>
            📊 Results & Updates
          </button>
        </div>

        <div className="resources-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Resources; 