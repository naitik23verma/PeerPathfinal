import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingPage from './LoadingPage.jsx';
import SignUp from './SignUp.jsx';
import FrontPage from './FrontPage.jsx';
import Dashboard from './Dashboard.jsx';
import Doubts from './Doubts.jsx';
import Collaboration from './Mentorship.jsx';
import Resources from './Resources.jsx';
import Profile from './Profile.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Chat from './Chat.jsx';
import Location from './Location.jsx';
import SearchResults from './SearchResults.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setShowLoadingPage(false);

      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          setCurrentUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleRegister = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (showLoadingPage || isLoading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? 
            <Login onLogin={handleLogin} /> : 
            <Navigate to="/front" replace />
          } />
          
          <Route path="/signup" element={
            !isAuthenticated ? 
            <SignUp onRegister={handleRegister} /> : 
            <Navigate to="/front" replace />
          } />
          
          <Route path="/register" element={
            !isAuthenticated ? 
            <Register onRegister={handleRegister} /> : 
            <Navigate to="/front" replace />
          } />
          
          <Route path="/front" element={
            <ProtectedRoute>
              <FrontPage currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/doubts" element={
            <ProtectedRoute>
              <Doubts currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/collaboration" element={
            <ProtectedRoute>
              <Collaboration currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/resources" element={
            <ProtectedRoute>
              <Resources currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/location" element={
            <ProtectedRoute>
              <Location currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchResults currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={
            isAuthenticated ? 
            <Navigate to="/front" replace /> : 
            <Navigate to="/signup" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
