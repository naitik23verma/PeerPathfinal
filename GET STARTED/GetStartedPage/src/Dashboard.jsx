import React from "react";
import { useNavigate } from "react-router-dom";
import BlurHeading from "./DashboardHeading.jsx";
import "./Dashboard.css";

const Card = ({ icon, title, description, onClick }) => (
  <div className="card" onClick={onClick}>
    <div className="fade-in">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="get-started-btn">Get Started</button>
    </div>
  </div>
);

export default function Dashboard({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleMentorship = () => {
    navigate('/mentorship');
  };

  const handleCollaboration = () => {
    navigate('/collaboration');
  };

  const handleResources = () => {
    navigate('/resources');
  };

  return (
    <div className="dashboard">
      <div className="background" />
      
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <span className="welcome-text">Welcome, {currentUser?.name || 'User'}!</span>
          <button onClick={() => navigate('/mentorship')}>Mentorship</button>
          <button onClick={() => navigate('/collaboration')}>Collaboration</button>
          <button onClick={() => navigate('/resources')}>Resources</button>
          <button onClick={() => navigate('/chat')}>Chat</button>
          <button onClick={() => navigate('/profile')}>Profile</button>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h1 className="heading">
          <BlurHeading
            text="Welcome to PeerPath"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8"
          />
        </h1>
        
        <div className="card-container">
          <Card
            icon="🧑‍🏫"
            title="Start Mentorship"
            description="Get guidance from seniors on career, academics and more."
            onClick={handleMentorship}
          />
          <Card
            icon="🤝"
            title="Start Collaborating"
            description="Team up with peers to build exciting projects."
            onClick={handleCollaboration}
          />
          <Card
            icon="📚"
            title="Resources & Chats"
            description="Access past sessions, guides and peer content."
            onClick={handleResources}
          />
        </div>
      </div>
    </div>
  );
}
