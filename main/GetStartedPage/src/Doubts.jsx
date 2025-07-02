import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import "./Doubts.css";
import { TrendingDoubts } from './TrendingDoubts.jsx';
import { TopHelpers } from './TopHelpers.jsx';
import { AskDoubt } from './AskDoubt.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import AdvancedFooter from './components/AdvancedFooter.jsx';


// DoubtCard styled like Top Helpers
function DoubtCard({ doubt, onSolve, onCall, onVideoCall, onChat, onLike, likedByCurrentUser, showMarkSolved, onMarkSolved, isAsker, onImageSolution, onImageClick, onTextSolution }) {
  const fileInputRef = useRef();
  const [showTextInput, setShowTextInput] = useState(false);
  const [solutionText, setSolutionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Animation variants for doubt cards
  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  return (
    <motion.div 
      className={`doubt-card${Array.isArray(doubt.solutions) && doubt.solutions.length > 0 ? ' has-solutions' : ''}${doubt.isResolved ? ' resolved' : ''}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="helper-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="helper-avatar"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {doubt.user && doubt.user.profilePhoto ? (
            <img
              src={`http://localhost:5000${doubt.user.profilePhoto}`}
              alt={doubt.user.username || 'User'}
              className="solution-avatar"
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span className="avatar-emoji">{(doubt.user?.username || doubt.user || 'U').charAt(0).toUpperCase()}</span>
          )}
        </motion.div>
        <div className="helper-info">
          <motion.h3 
            className="helper-name"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {doubt.question}
          </motion.h3>
          <motion.div 
            className="helper-rating"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="stars">Asked by: {typeof doubt.user === 'object' ? doubt.user.username : doubt.user}</span>
            {doubt.isResolved && (
              <motion.span 
                className="resolved-badge" 
                style={{ marginLeft: 8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                ✅ Solved
              </motion.span>
            )}
          </motion.div>
        </div>
      </motion.div>
      <motion.div 
        className="helper-bio"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p>{doubt.details}</p>
      </motion.div>
      {/* Solutions list visible to all */}
      <AnimatePresence>
        {Array.isArray(doubt.solutions) && doubt.solutions.length > 0 && (
          <motion.div 
            className="solutions-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="solutions-header"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Solutions ({doubt.solutions.length})
            </motion.div>
            {doubt.solutions.map((sol, index) => (
              <motion.div
                key={sol._id}
                className="solution-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  console.log('Solution clicked:', sol);
                  console.log('Solution keys:', Object.keys(sol));
                  console.log('Solution image property:', sol.image);
                  console.log('Solution solutionImage property:', sol.solutionImage);
                  
                  // Check for image in different possible properties
                  const hasImage = sol.image || sol.solutionImage || sol.imageUrl;
                  
                  if (hasImage) {
                    console.log('Image found, opening modal');
                    onImageClick(sol);
                  } else {
                    // For text-only solutions, maybe show a different modal or just log
                    console.log('Text solution clicked:', sol.content);
                    alert('This is a text-only solution. No image to display.');
                  }
                }}
                title={sol.image ? 'Click to view image' : 'View solution'}
              >
                {sol.user?.profilePhoto && (
                  <motion.img 
                    src={`http://localhost:5000${sol.user.profilePhoto}`} 
                    alt={sol.user?.username} 
                    className="solution-avatar"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <div className="solution-content">
                  <div className="solution-username">{sol.user?.username || 'Unknown'}</div>
                  {sol.image && (
                    <motion.img 
                      src={`http://localhost:5000${sol.image}`} 
                      alt="solution" 
                      className="solution-image"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  {sol.content && <div className="solution-text">{sol.content}</div>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        className="doubt-actions-carousel action-btn-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button 
          className="call-btn small-rect-btn" 
          onClick={() => onCall(doubt)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          📞
        </motion.button>
        {!isAsker && (
          <motion.button 
            className="chat-btn small-action-btn" 
            onClick={() => onChat(doubt)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            💬
          </motion.button>
        )}
        <motion.button
          className="gallery-btn small-rect-btn"
          title="Post Image Solution"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span role="img" aria-label="gallery">🖼️</span>
        </motion.button>
        {!doubt.isResolved && (
          <motion.button
            className="write-solution-btn small-action-btn"
            style={{ background: '#7c3aed', color: '#fff', marginLeft: 8, borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 600 }}
            onClick={() => setShowTextInput(v => !v)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {showTextInput ? 'Cancel' : '✍️ Write Solution'}
          </motion.button>
        )}
        <motion.button
          className="like-btn small-action-btn"
          style={{ fontSize: '1.2rem', color: likedByCurrentUser ? '#fbbf24' : '#a78bfa' }}
          onClick={() => onLike(doubt)}
          title={likedByCurrentUser ? 'Unlike' : 'Like'}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          👍 {Array.isArray(doubt.likes) ? doubt.likes.length : 0}
        </motion.button>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              onImageSolution(doubt, e.target.files[0]);
              e.target.value = '';
            }
          }}
        />
        {showTextInput && !doubt.isResolved && (
          <div style={{ width: '100%', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea
              className="solution-textarea"
              value={solutionText}
              onChange={e => setSolutionText(e.target.value)}
              placeholder="Type your solution here..."
              rows={3}
              style={{ width: '100%', borderRadius: 8, border: '1px solid #a78bfa', padding: 8, resize: 'vertical', fontSize: 16 }}
              disabled={submitting}
            />
            <motion.button
              className="submit-solution-btn"
              style={{ background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, alignSelf: 'flex-end' }}
              onClick={async () => {
                if (!solutionText.trim()) return;
                setSubmitting(true);
                await onTextSolution(doubt, solutionText, () => {
                  setSolutionText("");
                  setShowTextInput(false);
                }, () => setSubmitting(false));
              }}
              disabled={submitting || !solutionText.trim()}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </motion.button>
          </div>
        )}
        {showMarkSolved && !doubt.isResolved && (
          <motion.button 
            className="solve-btn" 
            onClick={() => onMarkSolved(doubt)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            ✔️ Mark as Solved
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Doubts({ currentUser, onLogout }){
    const [doubts, setDoubts] = useState([]);
    const [topHelpers, setTopHelpers] = useState([]);
    const [showAskDoubt, setShowAskDoubt] = useState(false);
    const [error, setError] = useState('');
    const [showSolutionModal, setShowSolutionModal] = useState(false);
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const [accepting, setAccepting] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [imageModal, setImageModal] = useState({ open: false, image: '', solver: '', profilePhoto: '' });

    // Carousel for doubts
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const doubtsCarouselRef = useRef(null);

    // Animation variants
    const pageVariants = {
      initial: { opacity: 0 },
      in: { opacity: 1 },
      out: { opacity: 0 }
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

    const staggerContainer = {
      animate: {
        transition: {
          staggerChildren: 0.1
        }
      }
    };

    // Map backend doubts to TrendingDoubts structure
    const mappedDoubts = (doubts || [])
      .filter(doubt => doubt && typeof doubt === 'object')
      .map(doubt => ({
        id: doubt._id || doubt.id,
        question: doubt.title || doubt.question || '',
        user: doubt.user,
        details: doubt.content || doubt.details || '',
        time: doubt.time || doubt.createdAt || '',
        replies: doubt.replies || (doubt.answers ? doubt.answers.length : 0) || 0,
        likes: doubt.likes || 0,
        category: doubt.category || 'general',
        tags: Array.isArray(doubt.tags) ? doubt.tags.map(t => String(t)) : [],
        isResolved: typeof doubt.isResolved === 'boolean' ? doubt.isResolved : false,
        solutions: Array.isArray(doubt.solutions) ? doubt.solutions.map(sol => ({ ...sol })) : []
      }))
      .filter(d => d.question && typeof d.question === 'string');

    // Sort mappedDoubts by like count descending
    const sortedDoubts = [...mappedDoubts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    // Check scroll position to show/hide buttons
    const checkScrollButtons = () => {
      if (doubtsCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = doubtsCarouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    useEffect(() => {
      checkScrollButtons();
      const carousel = doubtsCarouselRef.current;
      if (carousel) {
        carousel.addEventListener('scroll', checkScrollButtons);
        return () => carousel.removeEventListener('scroll', checkScrollButtons);
      }
    }, [sortedDoubts.length]);

    const scrollDoubtsLeft = () => {
      if (doubtsCarouselRef.current) {
        doubtsCarouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        setTimeout(checkScrollButtons, 400);
      }
    };
    const scrollDoubtsRight = () => {
      if (doubtsCarouselRef.current) {
        doubtsCarouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        setTimeout(checkScrollButtons, 400);
      }
    };

    // Call/Video Call handlers
    const handleCall = (doubt) => {
      // Get the doubt asker's user ID
      const doubtAskerId = typeof doubt.user === 'object' ? doubt.user._id : doubt.user;
      
      // Check if current user has mobile number
      if (!currentUser.mobileNumber) {
        alert('Please add your mobile number to your profile to make calls.');
        return;
      }
      
      // Check if doubt asker has mobile number
      if (!doubt.user.mobileNumber) {
        alert('The doubt asker has not provided their mobile number.');
        return;
      }
      
      // Initiate call using tel: protocol
      const callUrl = `tel:${doubt.user.mobileNumber}`;
      window.open(callUrl, '_blank');
      
      // Show confirmation message
      alert(`Initiating call to ${doubt.user.username || 'the doubt asker'} at ${doubt.user.mobileNumber}`);
    };
    const handleVideoCall = (doubt) => {
      alert(`Starting video call for: ${doubt.question}`);
    };
    const navigate = useNavigate();
    const handleChat = (doubt) => {
      // Get the doubt asker's user ID
      const doubtAskerId = typeof doubt.user === 'object' ? doubt.user._id : doubt.user;
      
      // Navigate to direct chat with the doubt asker
      navigate('/chat', { 
        state: { 
          userId: doubtAskerId,
          doubtId: doubt._id || doubt.id,
          doubtQuestion: doubt.question
        } 
      });
    };
    const handleSolve = async (doubt) => {
      try {
        // Mark the doubt as solved in the backend
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/doubts/${doubt.id}/solve`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Remove the solved doubt from the list
        setDoubts(prev => prev.filter(d => (d._id || d.id) !== doubt.id));
        // Optionally, increment the solver's count (fetch profile or update state)
      } catch (error) {
        alert('Failed to mark as solved.');
      }
    };
    const handleLike = async (doubt) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:5000/api/doubts/${doubt.id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Update the local state with the new like count
        setDoubts(prev => prev.map(d => (d._id || d.id) === doubt.id ? { ...d, likes: response.data.doubt.likes } : d));
      } catch (error) {
        alert('Failed to like/unlike doubt.');
      }
    };

    useEffect(() => {
        fetchDoubts();
        fetchTopHelpers();
    }, []);

    const fetchDoubts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/doubts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubts(response.data.doubts);
        } catch (error) {
            console.error('Error fetching doubts:', error);
            setError('Failed to load doubts');
        }
    };

    const fetchTopHelpers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/top-helpers');
            setTopHelpers(response.data);
        } catch (error) {
            console.error('Error fetching top helpers:', error);
        }
    };

    const handleDoubtSubmit = async (newDoubt) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/doubts', newDoubt, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Doubt posted:', response.data);
            setDoubts(prevDoubts => [response.data.doubt, ...prevDoubts]);
            setShowAskDoubt(false);
        } catch (error) {
            console.error('Error creating doubt:', error, error.response?.data);
            setError('Failed to create doubt');
        }
    };

    const handleDoubtUpdate = (updatedDoubts) => {
        setDoubts(updatedDoubts);
    };

    // Fetch solutions for a doubt
    const fetchSolutions = async (doubtId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/doubts/${doubtId}`);
        setSolutions(response.data.solutions || []);
      } catch (error) {
        setSolutions([]);
      }
    };

    // Open modal to select solution
    const handleOpenSolutionModal = async (doubt) => {
      setSelectedDoubt(doubt);
      await fetchSolutions(doubt.id);
      setShowSolutionModal(true);
    };

    // Toast helper
    const showToast = (message, type = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast({ message: '', type: '' }), 2500);
    };

    // Accept a solution
    const handleAcceptSolution = async (solutionId) => {
      if (!selectedDoubt) return;
      setAccepting(true);
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/doubts/${selectedDoubt.id}/solutions/${solutionId}/accept`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowSolutionModal(false);
        setAccepting(false);
        setDoubts(prev => prev.filter(d => (d._id || d.id) !== selectedDoubt.id));
        showToast('Doubt marked as solved! Solver credited.', 'success');
        // Download the solution image if present
        const acceptedSolution = (selectedDoubt.solutions || []).find(sol => (sol._id === solutionId || sol.id === solutionId) && sol.image);
        if (acceptedSolution && acceptedSolution.image) {
          const link = document.createElement('a');
          link.href = `http://localhost:5000${acceptedSolution.image}`;
          link.download = 'solution-image.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        setAccepting(false);
        showToast('Failed to accept solution.', 'error');
      }
    };

    // Image solution upload handler
    const handleImageSolution = async (doubt, file) => {
      if (!file) return;
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);
        await axios.post(`http://localhost:5000/api/doubts/${doubt.id}/solutions`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        await fetchDoubts();
        showToast('Image solution posted!', 'success');
        // If current user is the asker, open the solution modal for this doubt
        if (currentUser && ((typeof doubt.user === 'object' ? doubt.user._id : doubt.user) === currentUser._id)) {
          await handleOpenSolutionModal(doubt);
        }
      } catch (error) {
        showToast('Failed to upload image solution.', 'error');
      }
    };

    // Handler for submitting a text solution
    const handleTextSolution = async (doubt, text, onSuccess, onDone) => {
      if (!text.trim()) return;
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('content', text);
        await axios.post(`http://localhost:5000/api/doubts/${doubt.id}/solutions`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        await fetchDoubts();
        showToast('Solution posted!', 'success');
        if (onSuccess) onSuccess();
      } catch (error) {
        showToast('Failed to post solution.', 'error');
      } finally {
        if (onDone) onDone();
      }
    };

    return(
        <motion.div 
            className="doubts-page-container"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <NavigationBar 
                currentUser={currentUser}
                onLogout={onLogout} 
            />
            
            <motion.main 
                className="doubts-main-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <motion.div 
                    className="doubts-hero-section"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        Together We Learn.<motion.span 
                            className="center-grow"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            Together We Build.
                        </motion.span>
                    </motion.h1>
                    <motion.p 
                        style={{fontSize:30}}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        A space for all your doubts.
                    </motion.p>
                    <motion.button 
                        className="ask-doubt-hero-btn"
                        onClick={() => setShowAskDoubt(!showAskDoubt)}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ delay: 0.7 }}
                    >
                        {showAskDoubt ? 'Close Form' : '🤔 Ask Your Doubt'}
                    </motion.button>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="error-message"
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    className="doubts-body-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <AnimatePresence>
                        {showAskDoubt && (
                            <motion.div 
                                className="ask-doubt-modal"
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                 <AskDoubt 
                                    currentUser={currentUser} 
                                    onDoubtSubmit={handleDoubtSubmit}
                                    onCancel={() => setShowAskDoubt(false)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Doubts Carousel - now above Top Helpers */}
                    <motion.div 
                        className="carousel-wrapper"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                      {canScrollLeft && (
                        <motion.button 
                            className="scroll-btn scroll-left" 
                            onClick={scrollDoubtsLeft}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            ‹
                        </motion.button>
                      )}
                      <div className="carousel-container" ref={doubtsCarouselRef} style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}>
                        <div className="carousel-track" style={{ display: 'flex', gap: '1.5rem', minWidth: '100%' }}>
                          {sortedDoubts.map((doubt, idx) => {
                            // Debug logs
                            console.log('Doubt:', doubt);
                            console.log('Current user:', currentUser);
                            const doubtUserId = typeof doubt.user === 'object' ? doubt.user._id : doubt.user;
                            const currentUserId = currentUser && currentUser._id;
                            console.log('doubt.user:', doubt.user, 'typeof:', typeof doubt.user);
                            console.log('doubtUserId:', doubtUserId, 'currentUserId:', currentUserId);
                            console.log('doubtUserId == currentUserId:', doubtUserId == currentUserId);
                            console.log('doubtUserId === currentUserId:', doubtUserId === currentUserId);
                            console.log('isAsker:', doubtUserId === currentUserId);
                            console.log('showMarkSolved:', doubtUserId === currentUserId && !doubt.isResolved && (doubt.solutions && doubt.solutions.length > 0));
                            return (
                              <DoubtCard
                                key={doubt.id || idx}
                                doubt={doubt}
                                onSolve={handleSolve}
                                onCall={handleCall}
                                onVideoCall={handleVideoCall}
                                onChat={handleChat}
                                onLike={handleLike}
                                likedByCurrentUser={Array.isArray(doubt.likes) && currentUser && doubt.likes.some(id => id === currentUser._id)}
                                showMarkSolved={doubtUserId === currentUserId && !doubt.isResolved && (doubt.solutions && doubt.solutions.length > 0)}
                                onMarkSolved={() => handleOpenSolutionModal(doubt)}
                                isAsker={doubtUserId === currentUserId}
                                onImageSolution={handleImageSolution}
                                onImageClick={(sol) => {
                                  console.log('Image clicked:', sol);
                                  console.log('Setting imageModal to:', { 
                                    open: true, 
                                    image: sol.image || sol.solutionImage || sol.imageUrl, 
                                    solver: sol.user?.username || 'Unknown', 
                                    profilePhoto: sol.user?.profilePhoto 
                                  });
                                  alert('Image clicked! Modal should open.'); // Temporary debug
                                  setImageModal({ 
                                    open: true, 
                                    image: sol.image || sol.solutionImage || sol.imageUrl, 
                                    solver: sol.user?.username || 'Unknown', 
                                    profilePhoto: sol.user?.profilePhoto 
                                  });
                                }}
                                onTextSolution={handleTextSolution}
                              />
                            );
                          })}
                        </div>
                      </div>
                      {canScrollRight && (
                        <motion.button 
                            className="scroll-btn scroll-right" 
                            onClick={scrollDoubtsRight}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            ›
                        </motion.button>
                      )}
                    </motion.div>

                    {/* Top Helpers section below doubts */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                    >
                        <TopHelpers />
                    </motion.div>
                </motion.div>
            </motion.main>
            
            <AdvancedFooter />

            {/* Solution Accept Modal */}
            <Modal
              isOpen={showSolutionModal}
              onRequestClose={() => setShowSolutionModal(false)}
              contentLabel="Select Solution to Accept"
              className="group-modal"
              overlayClassName="group-modal-overlay"
              ariaHideApp={false}
            >
              <h2>Select Solution to Accept</h2>
              {solutions.length === 0 ? (
                <div style={{ color: '#a78bfa', textAlign: 'center', margin: '1.5rem 0' }}>No solutions yet.</div>
              ) : (
                <div className="group-members-list" style={{ flexDirection: 'column', gap: '1.2rem' }}>
                  {solutions.map((sol) => (
                    <div key={sol._id} style={{ background: '#1a0a52', borderRadius: 12, padding: '1rem', border: '1.5px solid #a78bfa', marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, color: '#c4b5fd', marginBottom: 6 }}>By: {sol.user?.username || 'Unknown'}</div>
                      {sol.image && (
                        <img src={`http://localhost:5000${sol.image}`} alt="solution" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginBottom: 8 }} />
                      )}
                      <div style={{ color: '#a78bfa', marginBottom: 8 }}>{sol.content}</div>
                      <button
                        className="create-group-btn"
                        style={{ margin: 0, minWidth: 120 }}
                        disabled={accepting}
                        onClick={() => handleAcceptSolution(sol._id)}
                      >
                        {accepting ? 'Accepting...' : 'Accept This Solution'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button className="close-modal-btn" onClick={() => setShowSolutionModal(false)}>Cancel</button>
            </Modal>

            {/* Toast notification */}
            {toast.message && (
              <div style={{
                position: 'fixed',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                background: toast.type === 'success' ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#ef4444,#dc2626)',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: 12,
                fontWeight: 600,
                zIndex: 9999,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                fontSize: '1.1rem',
                letterSpacing: 0.5
              }}>
                {toast.message}
              </div>
            )}

            {/* Image Solution Modal */}
            {imageModal.open && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.7)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }} onClick={() => {
                console.log('Modal background clicked, closing modal');
                setImageModal({ open: false, image: '', solver: '', profilePhoto: '' });
              }}>
                <div style={{ background: '#1a0a52', borderRadius: 16, padding: 24, position: 'relative', minWidth: 320, maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 8px 32px rgba(139,92,246,0.25)' }} onClick={e => e.stopPropagation()}>
                  <button style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }} onClick={() => {
                    console.log('Close button clicked');
                    setImageModal({ open: false, image: '', solver: '', profilePhoto: '' });
                  }}>&times;</button>
                  {imageModal.profilePhoto && (
                    <img src={`http://localhost:5000${imageModal.profilePhoto}`} alt={imageModal.solver} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />
                  )}
                  <div style={{ color: '#c4b5fd', fontWeight: 600, fontSize: '1.1rem', marginBottom: 12 }}>{imageModal.solver}</div>
                  <img src={`http://localhost:5000${imageModal.image}`} alt="solution" style={{ maxWidth: '70vw', maxHeight: '60vh', borderRadius: 10, display: 'block', margin: '0 auto' }} />
                </div>
              </div>
            )}
            
            {/* Debug info */}
            {imageModal.open && (
              <div style={{
                position: 'fixed',
                top: 10,
                right: 10,
                background: 'red',
                color: 'white',
                padding: '10px',
                zIndex: 10000,
                fontSize: '12px'
              }}>
                Modal is open! Image: {imageModal.image}
                
              </div>
              
            )}
        </motion.div>
        
    );
}