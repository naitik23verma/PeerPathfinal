import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import Mentorship from './Mentorship.jsx';
import Collaboration from './Collaboration.jsx';
import Resources from './Resources.jsx';
import Profile from './Profile.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Chat from './Chat.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? 
            <Login onLogin={handleLogin} /> : 
            <Navigate to="/dashboard" replace />
          } />
          <Route path="/register" element={
            !isAuthenticated ? 
            <Register onRegister={handleLogin} /> : 
            <Navigate to="/dashboard" replace />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? 
            <Dashboard currentUser={currentUser} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/mentorship" element={
            isAuthenticated ? 
            <Mentorship currentUser={currentUser} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/collaboration" element={
            isAuthenticated ? 
            <Collaboration currentUser={currentUser} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/resources" element={
            isAuthenticated ? 
            <Resources currentUser={currentUser} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/profile" element={
            isAuthenticated ? 
            <Profile currentUser={currentUser} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/chat" element={
            isAuthenticated ? 
            <Chat currentUser={currentUser} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } />
          <Route path="/" element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
