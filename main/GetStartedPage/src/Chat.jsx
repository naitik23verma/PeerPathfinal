import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Chat.css';
import Modal from 'react-modal';
import NavigationBar from './components/NavigationBar.jsx';

const Chat = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const params = useParams ? useParams() : {};
  const [roomId, setRoomId] = useState(null);
  const [groups, setGroups] = useState(() => {
    const stored = localStorage.getItem('groups');
    return stored ? JSON.parse(stored) : [];
  });
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [socket, setSocket] = useState(null);
  const [doubtContext, setDoubtContext] = useState(null);

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

  const messageVariants = {
    initial: { opacity: 0, x: -50, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 50, scale: 0.9 }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const chatContainerVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Initialize Socket.IO connection when component mounts
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from Socket.IO server');
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

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
    if (!socket) return;

    socket.on('receive-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    return () => {
      socket.off('receive-message');
    };
  }, [socket]);

  useEffect(() => {
    if (location.state && location.state.userId && users.length > 0) {
      const userToSelect = users.find(u => u._id === location.state.userId);
      if (userToSelect) setSelectedUser(userToSelect);
      
      // Set doubt context if available
      if (location.state.doubtId && location.state.doubtQuestion) {
        setDoubtContext({
          doubtId: location.state.doubtId,
          doubtQuestion: location.state.doubtQuestion
        });
      }
    }
  }, [location.state, users]);

  // Send initial message when chat is initiated from doubt
  useEffect(() => {
    if (doubtContext && selectedUser && currentUser && socket && messages.length === 0) {
      const initialMessage = {
        roomId: [currentUser._id, selectedUser._id].sort().join('_'),
        content: `Hi! I'd like to discuss your doubt: "${doubtContext.doubtQuestion}"`,
        sender: { _id: currentUser._id, username: currentUser.username, profilePhoto: currentUser.profilePhoto },
        receiver: selectedUser._id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Send the initial message
      socket.emit('send-message', initialMessage);
      setMessages([initialMessage]);
      
      // Save to backend
      const sendInitialMessage = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.post('http://localhost:5000/api/users/chat', {
            roomId: initialMessage.roomId,
            content: initialMessage.content,
            receiver: initialMessage.receiver,
            time: initialMessage.time
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (error) {
          console.error('Error saving initial message:', error);
        }
      };
      sendInitialMessage();
    }
  }, [doubtContext, selectedUser, currentUser, socket, messages.length]);

  useEffect(() => {
    if (selectedUser && currentUser && socket) {
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
  }, [selectedUser, currentUser, socket]);

  // Detect group chat room from URL
  useEffect(() => {
    if (!socket) return;
    
    const path = location.pathname;
    const match = path.match(/\/chat\/doubt_(.+)$/);
    if (match) {
      const doubtId = match[1];
      setRoomId(`doubt_${doubtId}`);
      socket.emit('join-room', `doubt_${doubtId}`);
      setSelectedUser(null); // Not a one-on-one chat
      setMessages([]);
      // Fetch group messages
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/users/chat/doubt_${doubtId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching group chat history:', error);
        }
      };
      fetchMessages();
    }
  }, [location.pathname, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Updated isGroupChat logic
  const isGroupChat = roomId && (roomId.startsWith('doubt_') || roomId.startsWith('group_'));

  const handleSendMessage = async () => {
    if (message.trim() && (selectedUser || isGroupChat) && roomId && socket) {
      const messageData = {
        roomId,
        content: message.trim(),
        sender: { _id: currentUser._id, username: currentUser.username, profilePhoto: currentUser.profilePhoto },
        receiver: selectedUser ? selectedUser._id : null,
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

  // Helper: all chats for sidebar
  const allChats = [
    ...groups.map(g => ({ type: 'group', ...g })),
    ...users.map(u => ({ type: 'user', ...u }))
  ];

  // Helper: select chat
  const handleSelectChat = (chat) => {
    if (chat.type === 'user') {
      setSelectedUser(chat);
      setRoomId([currentUser._id, chat._id].sort().join('_'));
    } else if (chat.type === 'group') {
      setSelectedUser(null);
      setRoomId(chat.roomId);
    }
  };

  // Add new group using backend API
  const handleCreateGroup = async () => {
    if (!groupName.trim() || groupMembers.length < 2) return;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/groups', {
      groupName: groupName.trim(),
        members: groupMembers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newGroup = response.data;
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setShowGroupModal(false);
    setGroupName('');
    setGroupMembers([]);
    } catch (error) {
      alert('Failed to create group: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/groups', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroups(response.data);
        localStorage.setItem('groups', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, []);

  return (
    <motion.div 
      className="chat-page"
      style={{ paddingTop: navbarVisible ? 120 : 0 }}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Navbar Toggle Button */}
      <button
        className="navbar-toggle-btn"
        onClick={() => setNavbarVisible(v => !v)}
        style={{
          position: 'fixed',
          top: navbarVisible ? 130 : 20,
          left: 20,
          zIndex: 2001,
          background: 'rgba(26,10,82,0.85)',
          border: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          color: '#c4b5fd',
          fontSize: 22
        }}
        title={navbarVisible ? 'Hide Navbar' : 'Show Navbar'}
      >
        {navbarVisible ? '▲' : '▼'}
      </button>
      {/* Conditionally render NavigationBar */}
      {navbarVisible && (
        <NavigationBar 
          currentUser={currentUser}
          onLogout={onLogout}
          showUserInfo={true}
          showNotifications={true}
          showSearch={false}
        />
      )}

      <motion.div 
        className="chat-content"
        variants={chatContainerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="chat-sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="chat-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              💬 Chats
            </motion.h2>
            <motion.button 
              className="new-group-btn" 
              onClick={() => setShowGroupModal(true)}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ delay: 0.7 }}
            >
              + New Group
            </motion.button>
            <motion.div 
              className="search-box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </motion.div>
          </motion.div>

          <motion.div 
            className="users-list"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* List user-created groups */}
            {groups.filter(g => g.groupName.toLowerCase().includes(searchTerm.toLowerCase())).map((group, index) => (
              <motion.div
                key={group.roomId}
                className={`user-item ${roomId === group.roomId ? 'active' : ''}`}
                onClick={() => handleSelectChat({ type: 'group', ...group })}
                variants={messageVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.div 
                  className="user-avatar group-avatar"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#4c1d95',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 600
                  }}
                >
                  {group.groupName.charAt(0).toUpperCase()}
                </motion.div>
                <div className="user-info">
                  <span className="user-name">{group.groupName}</span>
                  <span className="group-members-names" style={{ fontSize: '0.85rem', color: '#c4b5fd', display: 'block', marginTop: 2 }}>
                    {group.members && group.members.map(m => (m.username || m.name)).join(', ')}
                  </span>
                </div>
              </motion.div>
            ))}
            {/* List one-on-one users */}
            {sortedUsers.filter(user => (user.name || user.username)?.toLowerCase().includes(searchTerm.toLowerCase())).map((user, index) => (
              <motion.div
                key={user._id}
                className={`user-item ${selectedUser?._id === user._id && !roomId?.startsWith('group_') ? 'active' : ''}`}
                onClick={() => handleSelectChat({ type: 'user', ...user })}
                variants={messageVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.div 
                  className="user-avatar"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {user.profilePhoto ? (
                    <img 
                      src={`http://localhost:5000${user.profilePhoto}`} 
                      alt={user.name || user.username}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      onError={e => { e.target.src = '/peerpath.png'; }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: '#c4b5fd'
                    }}>
                      {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                </div>
                  )}
                </motion.div>
                <div className="user-info">
                  <span className="user-name">{user.name || user.username}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="chat-main"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          {roomId ? (
            <>
              <motion.div 
                className="chat-header-main"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="chat-user-info">
                  {roomId.startsWith('group_') ? (
                    <>
                      <div
                        className="user-avatar-main group-avatar-main"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: '#4c1d95',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: 700,
                          marginRight: 16
                        }}
                      >
                        {groups.find(g => g.roomId === roomId)?.groupName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{groups.find(g => g.roomId === roomId)?.groupName || 'Group Chat'}</h3>
                        <div className="group-members-list-header" style={{ fontSize: '0.95rem', color: '#c4b5fd', marginTop: 2 }}>
                          {groups.find(g => g.roomId === roomId)?.members.map(m => (m.username || m.name)).join(', ')}
                        </div>
                      </div>
                    </>
                  ) : roomId.startsWith('doubt_') ? (
                    <>
                      <div>
                        <h3>Group Chat for Doubt #{roomId.replace('doubt_', '')}</h3>
                        <span className="status-text online">🟢 Group Chat</span>
                      </div>
                    </>
                  ) : selectedUser ? (
                    <>
                      <motion.div 
                        className="user-avatar-main"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedUser.profilePhoto ? (
                          <img 
                            src={`http://localhost:5000${selectedUser.profilePhoto}`} 
                            alt={selectedUser.name || selectedUser.username}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            onError={e => { e.target.src = '/peerpath.png'; }}
                          />
                        ) : (
                          (selectedUser.name || selectedUser.username || 'U').charAt(0).toUpperCase()
                        )}
                      </motion.div>
                      <div>
                        <h3>{selectedUser.name || selectedUser.username}</h3>
                        <span className="status-text online">Online</span>
                        {doubtContext && (
                          <motion.div 
                            className="doubt-context"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                              marginTop: '5px',
                              padding: '8px 12px',
                              backgroundColor: 'rgba(196, 181, 253, 0.1)',
                              borderRadius: '8px',
                              border: '1px solid rgba(196, 181, 253, 0.3)',
                              fontSize: '12px',
                              color: '#c4b5fd'
                            }}
                          >
                            <strong>💬 Chat initiated from doubt:</strong><br />
                            "{doubtContext.doubtQuestion}"
                          </motion.div>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </motion.div>

              <motion.div 
                className="messages-container"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence>
                {messages.map((msg, index) => (
                    <motion.div
                    key={index}
                    className={`message ${msg.sender._id === currentUser._id ? 'own' : 'other'}`}
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ delay: index * 0.05 }}
                  >
                    <div className="message-sender-info">
                      <span className="chat-message-username">{msg.sender.username}</span>
                    </div>
                      <motion.div 
                        className="message-content"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                      <p>{msg.content}</p>
                      <span className="message-time">{msg.time}</span>
                      </motion.div>
                    </motion.div>
                ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </motion.div>

              <motion.div 
                className="message-input-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="message-input-wrapper">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message...`}
                    rows="1"
                    style={{
                      resize: 'none',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: '#ffffff',
                      fontSize: '1rem',
                      width: '100%',
                      padding: '0.8rem 0'
                    }}
                  />
                  <motion.button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    style={{
                      background: message.trim() ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' : 'rgba(156, 163, 175, 0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: message.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      fontSize: '1.2rem'
                    }}
                  >
                    ➤
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="no-chat-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                Welcome to PeerPath Chat! 💬
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                Select a chat or create a group to start messaging
              </motion.p>
              <motion.div 
                className="chat-features"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div 
                  className="feature"
                  variants={messageVariants}
                  whileHover={{ scale: 1.05 }}
                >
                    <span>🔒</span>
                    <p>Secure messaging</p>
                </motion.div>
                <motion.div 
                  className="feature"
                  variants={messageVariants}
                  whileHover={{ scale: 1.05 }}
                >
                    <span>⚡</span>
                    <p>Real-time updates</p>
                </motion.div>
                <motion.div 
                  className="feature"
                  variants={messageVariants}
                  whileHover={{ scale: 1.05 }}
                >
                    <span>👥</span>
                    <p>Group & one-on-one chats</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* New Group Modal */}
      <AnimatePresence>
        {showGroupModal && (
      <Modal
        isOpen={showGroupModal}
        onRequestClose={() => setShowGroupModal(false)}
        contentLabel="Create Group"
        className="group-modal"
        overlayClassName="group-modal-overlay"
        ariaHideApp={false}
      >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Create New Group
              </motion.h2>
              <motion.input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              />
              <motion.div 
                className="group-members-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {users.map((user, index) => (
                  <motion.label 
                    key={user._id} 
                    className="group-member-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
              <input
                type="checkbox"
                checked={groupMembers.includes(user._id)}
                      onChange={(e) => {
                  if (e.target.checked) {
                    setGroupMembers(prev => [...prev, user._id]);
                  } else {
                    setGroupMembers(prev => prev.filter(id => id !== user._id));
                  }
                }}
              />
              <span>{user.name || user.username}</span>
                  </motion.label>
          ))}
              </motion.div>
              <motion.button
          className="create-group-btn"
          onClick={handleCreateGroup}
          disabled={!groupName.trim() || groupMembers.length < 2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
        >
          Create Group
              </motion.button>
              <motion.button
                className="close-modal-btn"
                onClick={() => setShowGroupModal(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Cancel
              </motion.button>
            </motion.div>
      </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Chat; 