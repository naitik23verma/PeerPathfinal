import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Chat.css';

const mockUsers = [
  { id: 1, name: 'Satyam Sharma', avatar: '👨‍💻', status: 'online', lastMessage: 'Hey, how\'s the DSA practice going?' },
  { id: 2, name: 'Ananya Jain', avatar: '👩‍💻', status: 'online', lastMessage: 'Thanks for the React tips!' },
  { id: 3, name: 'Rohit Yadav', avatar: '👨‍🎓', status: 'offline', lastMessage: 'See you in the next session' },
  { id: 4, name: 'Priya Singh', avatar: '👩‍🎓', status: 'online', lastMessage: 'Can you help with the algorithm?' }
];

const mockMessages = {
  1: [
    { id: 1, sender: 'Satyam Sharma', content: 'Hey, how\'s the DSA practice going?', time: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', content: 'Going well! Just finished the binary tree problems', time: '10:32 AM', isOwn: true },
    { id: 3, sender: 'Satyam Sharma', content: 'Great! Want to discuss some advanced tree algorithms?', time: '10:33 AM', isOwn: false }
  ],
  2: [
    { id: 1, sender: 'Ananya Jain', content: 'Thanks for the React tips!', time: '9:15 AM', isOwn: false },
    { id: 2, sender: 'You', content: 'You\'re welcome! How\'s your project coming along?', time: '9:20 AM', isOwn: true },
    { id: 3, sender: 'Ananya Jain', content: 'It\'s going great! Almost done with the frontend', time: '9:22 AM', isOwn: false }
  ]
};

const Chat = ({ currentUser, onLogout }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        content: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };

      // In a real app, you'd send this to the backend
      console.log('Sending message:', newMessage);
      
      setMessage('');
      // Simulate receiving a response
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          sender: selectedUser.name,
          content: 'Thanks for the message! I\'ll get back to you soon.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false
        };
        console.log('Received response:', response);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = selectedUser ? (mockMessages[selectedUser.id] || []) : [];

  return (
    <div className="chat-container">
      <nav className="chat-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/mentorship">Mentorship</Link>
          <Link to="/collaboration">Collaboration</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/chat" className="active">Chat</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="chat-content">
        <div className="chat-sidebar">
          <div className="chat-header">
            <h2>💬 Messages</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="users-list">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-avatar">
                  <span className="avatar-text">{user.avatar}</span>
                  <span className={`status-indicator ${user.status}`}></span>
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {selectedUser ? (
            <>
              <div className="chat-header-main">
                <div className="chat-user-info">
                  <span className="user-avatar-main">{selectedUser.avatar}</span>
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <span className={`status-text ${selectedUser.status}`}>
                      {selectedUser.status === 'online' ? '🟢 Online' : '⚫ Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.isOwn ? 'own' : 'other'}`}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    className="message-input"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="send-btn"
                  >
                    📤
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <h2>💬 Welcome to PeerPath Chat</h2>
                <p>Select a user from the sidebar to start chatting</p>
                <div className="chat-features">
                  <div className="feature">
                    <span>🔒</span>
                    <p>Secure messaging</p>
                  </div>
                  <div className="feature">
                    <span>⚡</span>
                    <p>Real-time updates</p>
                  </div>
                  <div className="feature">
                    <span>👥</span>
                    <p>Connect with peers</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 