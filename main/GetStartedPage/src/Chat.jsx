import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter out the current user from the list
        setUsers(response.data.filter(user => user._id !== currentUser._id));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  useEffect(() => {
    if (location.state && location.state.userId && users.length > 0) {
      const userToSelect = users.find(u => u._id === location.state.userId);
      if (userToSelect) setSelectedUser(userToSelect);
    }
  }, [location.state, users]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      const generateRoomId = (id1, id2) => [id1, id2].sort().join('_');
      const newRoomId = generateRoomId(currentUser._id, selectedUser._id);
      setRoomId(newRoomId);
      socket.emit('join-room', newRoomId);
      setMessages([]); // Clear previous messages
      // Fetch historical messages for the room
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/users/chat/${newRoomId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser && roomId) {
      const messageData = {
        roomId,
        content: message.trim(),
        sender: { _id: currentUser._id, name: currentUser.name },
        receiver: selectedUser._id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit('send-message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
      // Save to backend
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/users/chat', {
          roomId: messageData.roomId,
          content: messageData.content,
          receiver: messageData.receiver,
          time: messageData.time
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error saving chat message:', error);
      }
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sort users: matching users first, then the rest
  const matchingUsers = users.filter(
    user => (user.name || user.username)?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const nonMatchingUsers = users.filter(
    user => !(user.name || user.username)?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedUsers = [...matchingUsers, ...nonMatchingUsers];

  return (
    <div className="chat-container">
      <nav className="collaboration-nav">
        <div className="nav-logo">
          <img src="/peerpath.png" alt="PeerPath" />
          <h1>PeerPath</h1>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/doubts">Doubts</Link>
          <Link to="/collaboration">Collaboration</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/chat" className="active">Chat</Link>
          <Link to="/location">Location</Link>
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
            {sortedUsers.map((user) => (
              <div
                key={user._id}
                className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-avatar">
                  <img src={user.profilePhoto || '/peerpath.png'} alt={user.name || user.username} className="avatar-img" />
                  <span className={`status-indicator online`}></span>
                </div>
                <div className="user-info">
                  <h4>{user.name || user.username}</h4>
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
                  <img src={selectedUser.profilePhoto || '/peerpath.png'} alt={selectedUser.name} className="user-avatar-main" />
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <span className={`status-text online`}>
                      🟢 Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender._id === currentUser._id ? 'own' : 'other'}`}
                  >
                    <div className="message-sender-info">
                      <img
                        src={msg.sender.profilePhoto || '/peerpath.png'}
                        alt={msg.sender.username}
                        className="chat-message-avatar"
                      />
                      <span className="chat-message-username">{msg.sender.username}</span>
                    </div>
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
                    placeholder={`Message ${selectedUser.name}...`}
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