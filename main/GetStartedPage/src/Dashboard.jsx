import React from "react";
import { useNavigate, Link } from "react-router-dom";
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
    navigate('/doubts');
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
      <nav className="collaboration-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/doubts">Doubts</Link>
          <Link to="/collaboration">Collaboration</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/location">Location</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h1 className="heading">
          <BlurHeading
            text={`Welcome, ${currentUser?.username || 'User'}!`}
            delay={100}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8"
          />
        </h1>
        
        <div className="card-container ">
          <Card className="fancy-gradient-card box"
            icon="🧑‍🏫"
            title="Start Mentorship"
            description="Get guidance from seniors on career, academics and more."
            onClick={handleMentorship}
          />
          <Card className="fancy-gradient-card box"
            icon="🤝"
            title="Start Collaborating"
            description="Team up with peers to build exciting projects."
            onClick={handleCollaboration}
          />
          <Card className="fancy-gradient-card box"
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
