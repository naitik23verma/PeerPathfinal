import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Doubts.css";
import { TrendingDoubts } from './TrendingDoubts.jsx';
import { TopHelpers } from './TopHelpers.jsx';
import { AskDoubt } from './AskDoubt.jsx';

export default function Doubts({ currentUser, onLogout }){
    const [doubts, setDoubts] = useState([]);
    const [topHelpers, setTopHelpers] = useState([]);
    const [showAskDoubt, setShowAskDoubt] = useState(false);
    const [error, setError] = useState('');

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
            
            setDoubts(prevDoubts => [response.data.doubt, ...prevDoubts]);
            setShowAskDoubt(false);
        } catch (error) {
            console.error('Error creating doubt:', error);
            setError('Failed to create doubt');
        }
    };

    const handleDoubtUpdate = (updatedDoubts) => {
        setDoubts(updatedDoubts);
    };

    // Map backend doubts to TrendingDoubts structure
    const mappedDoubts = (doubts || [])
      .filter(doubt => doubt && typeof doubt === 'object')
      .map(doubt => ({
        id: doubt._id || doubt.id,
        question: typeof doubt.question === 'string' ? doubt.question : '',
        user: typeof doubt.user === 'object' ? (doubt.user.username || doubt.user.name || 'Unknown') : (doubt.user || 'Unknown'),
        time: doubt.time || doubt.createdAt || '',
        replies: doubt.replies || (doubt.answers ? doubt.answers.length : 0) || 0,
        likes: doubt.likes || 0,
        category: doubt.category || 'general',
        tags: Array.isArray(doubt.tags) ? doubt.tags.map(t => String(t)) : [],
        details: doubt.details || doubt.content || '',
        isResolved: typeof doubt.isResolved === 'boolean' ? doubt.isResolved : false
      }))
      .filter(d => d.question && typeof d.question === 'string');
    console.log('mappedDoubts:', mappedDoubts);

    return(
        <div className="doubts-page-container">
            <nav className="collaboration-nav">
                <div className="nav-logo">
                    <img src="/peerpath.png" alt="PeerPath" />
                    <h1>PeerPath</h1>
                </div>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/doubts" className="active">Doubts</Link>
                    <Link to="/collaboration">Collaboration</Link>
                    <Link to="/resources">Resources</Link>
                    <Link to="/chat">Chat</Link>
                    <Link to="/location">Location</Link>
                    <Link to="/profile">Profile</Link>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
            
            <main className="doubts-main-content">
                <div className="doubts-hero-section">
                    <h1>
                        Together We Learn.<span className="center-grow">Together We Build.</span>
                    </h1>
                    <p style={{fontSize:30}}>A space for all your doubts.</p>
                    <button 
                        className="ask-doubt-hero-btn"
                        onClick={() => setShowAskDoubt(!showAskDoubt)}
                    >
                        {showAskDoubt ? 'Close Form' : '🤔 Ask Your Doubt'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="doubts-body-content">
                    {showAskDoubt && (
                        <div className="ask-doubt-modal">
                             <AskDoubt 
                                currentUser={currentUser} 
                                onDoubtSubmit={handleDoubtSubmit}
                                onCancel={() => setShowAskDoubt(false)}
                            />
                        </div>
                    )}
                    
                    <TrendingDoubts 
                        doubts={mappedDoubts}
                        onDoubtUpdate={handleDoubtUpdate}
                        currentUser={currentUser}
                    />
                    
                    <TopHelpers />
                </div>

                <section className="about-creators-section">
                    <div className="about-creators-content">
                        <h3>About the Creators</h3>
                        <div className="creator-cards">
                            <div className="creator-card">
                                <div className="creator-image-placeholder" />
                                <h4>Satyam Sharma</h4>
                                <p>2nd Year CSE Student, MANIT</p>
                                <div className="creator-socials">
                                    <a href="#" aria-label="LinkedIn">L</a>
                                    <a href="#" aria-label="GitHub">G</a>
                                </div>
                            </div>
                            <div className="creator-card">
                                <div className="creator-image-placeholder" />
                                <h4>Naitik Verma</h4>
                                <p>2nd Year CSE Student, MANIT</p>
                                <div className="creator-socials">
                                    <a href="#" aria-label="LinkedIn">L</a>
                                    <a href="#" aria-label="GitHub">G</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="doubts-footer">
                <div className="footer-content">
                    <div className="footer-bottom">
                        <p>© 2025 PeerPath. All rights reserved.</p>
                        <p>Made with ❤️ by the PeerPath Team</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}