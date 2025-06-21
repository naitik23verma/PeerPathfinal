import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Mentorship.css";
import { TrendingDoubts } from './TrendingDoubts.jsx';
import { TopHelpers } from './TopHelpers.jsx';
import { AskDoubt } from './AskDoubt.jsx';

export default function Mentorship({ currentUser, onLogout }){
    const [doubts, setDoubts] = useState([
        {
            id: 1,
            question: "How to start with Open Source?",
            user: "Riya",
            time: "2 hrs ago",
            replies: 12,
            likes: 8,
            category: "programming",
            tags: ["open-source", "github", "beginner"],
            details: "Start by finding beginner-friendly repositories on GitHub and reading their contribution guidelines.",
            isResolved: false
        },
        {
            id: 2,
            question: "Best resources to learn DSA?",
            user: "Aman",
            time: "5 hrs ago",
            replies: 8,
            likes: 15,
            category: "academics",
            tags: ["dsa", "algorithms", "leetcode"],
            details: "Check out LeetCode, GeeksforGeeks, and freeCodeCamp for DSA resources.",
            isResolved: true
        },
        {
            id: 3,
            question: "How to manage time in college?",
            user: "Neha",
            time: "1 day ago",
            replies: 15,
            likes: 23,
            category: "study-tips",
            tags: ["time-management", "college", "productivity"],
            details: "Use planners, set priorities, and avoid procrastination for better time management.",
            isResolved: false
        },
        {
            id: 4,
            question: "React vs Vue.js for beginners?",
            user: "Priya",
            time: "3 hrs ago",
            replies: 6,
            likes: 4,
            category: "programming",
            tags: ["react", "vue", "frontend"],
            details: "Both are great frameworks. React has more job opportunities, Vue is easier to learn.",
            isResolved: false
        },
        {
            id: 5,
            question: "Tips for first technical interview?",
            user: "Rahul",
            time: "6 hrs ago",
            replies: 9,
            likes: 12,
            category: "career",
            tags: ["interview", "technical", "preparation"],
            details: "Practice coding problems, review fundamentals, and prepare for behavioral questions.",
            isResolved: false
        }
    ]);

    const [showAskDoubt, setShowAskDoubt] = useState(false);

    const handleDoubtSubmit = (newDoubt) => {
        setDoubts(prevDoubts => [newDoubt, ...prevDoubts]);
        setShowAskDoubt(false);
    };

    const handleDoubtUpdate = (updatedDoubts) => {
        setDoubts(updatedDoubts);
    };

    return(
        <div className="mentorship-page-container">
            <nav className="mentorship-nav">
                <div className="mentorship-logo">
                    <div className="Logo-img"><img className="Logo-img"  src="/peerpath.png" alt="Logo" /></div>
                    <h1>PeerPath</h1>
                </div>
                <div className="mentorship-links">
                    <ul className="mentorship-menu">
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/mentorship" className="active">Mentorship</Link></li>
                        <li><Link to="/collaboration">Collaboration</Link></li>
                        <li><Link to="/resources">Resources</Link></li>
                        <li><Link to="/chat">Chat</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
                    </ul>
                </div>
            </nav>
            
            <main className="mentorship-main-content">
                <div className="mentorship-content">
                    <h1>
                        Together We Learn.<span className="center-grow">Together We Build.</span>
                    </h1>
                    <p style={{fontSize:30}}>A space where peers support each other's growth.</p>
                    <button 
                        className="ask-doubt-hero-btn"
                        onClick={() => setShowAskDoubt(!showAskDoubt)}
                    >
                        🤔 Ask Your Doubt
                    </button>
                </div>

                <div className="mentorship-sections">
                    {showAskDoubt && (
                        <AskDoubt 
                            currentUser={currentUser} 
                            onDoubtSubmit={handleDoubtSubmit}
                        />
                    )}
                    
                    <TrendingDoubts 
                        doubts={doubts}
                        onDoubtUpdate={handleDoubtUpdate}
                    />
                    
                    <TopHelpers/>
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
            
            <footer className="mentorship-footer">
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