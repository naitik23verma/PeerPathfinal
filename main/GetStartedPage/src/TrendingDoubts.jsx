import React, { useState } from "react";
import "./Cards.css";

// Initial doubts data
const initialDoubts = [
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
];

export function TrendingDoubts({ doubts = initialDoubts, onDoubtUpdate }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = (doubt) => {
    setSelected(doubt);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleLike = (doubtId) => {
    const updatedDoubts = doubts.map(doubt => 
      doubt.id === doubtId 
        ? { ...doubt, likes: doubt.likes + 1 }
        : doubt
    );
    onDoubtUpdate?.(updatedDoubts);
  };

  const handleResolve = (doubtId) => {
    const updatedDoubts = doubts.map(doubt => 
      doubt.id === doubtId 
        ? { ...doubt, isResolved: !doubt.isResolved }
        : doubt
    );
    onDoubtUpdate?.(updatedDoubts);
  };

  const filteredDoubts = doubts.filter(doubt => {
    const matchesFilter = filter === "all" || doubt.category === filter;
    const matchesSearch = doubt.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doubt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "programming", label: "Programming" },
    { value: "academics", label: "Academics" },
    { value: "career", label: "Career" },
    { value: "technology", label: "Technology" },
    { value: "study-tips", label: "Study Tips" },
    { value: "project-help", label: "Project Help" },
    { value: "general", label: "General" }
  ];

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">🔥 Trending Doubts</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search doubts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-grid">
        {filteredDoubts.map((item) => (
          <div
            className={`doubt-card ${item.isResolved ? 'resolved' : ''}`}
            key={item.id}
            onClick={() => handleOpen(item)}
          >
            <div className="doubt-header">
              <h3>❓ {item.question}</h3>
              {item.isResolved && <span className="resolved-badge">✅ Resolved</span>}
            </div>
            <div className="doubt-meta">
              <p>👤 {item.user} | ⏱️ {item.time}</p>
              <p>💬 {item.replies} Answers | ❤️ {item.likes} Likes</p>
            </div>
            <div className="doubt-tags">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="tag">#{tag}</span>
              ))}
            </div>
            <div className="doubt-actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(item.id);
                }}
                className="like-btn"
              >
                ❤️ {item.likes}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleResolve(item.id);
                }}
                className={`resolve-btn ${item.isResolved ? 'resolved' : ''}`}
              >
                {item.isResolved ? '✅ Resolved' : '🔓 Mark Resolved'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDoubts.length === 0 && (
        <div className="no-doubts">
          <p>No doubts found matching your criteria.</p>
        </div>
      )}

      {open && selected && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>
              &times;
            </button>
            <div className="modal-header">
              <h2>{selected.question}</h2>
              {selected.isResolved && <span className="resolved-badge">✅ Resolved</span>}
            </div>
            <div className="modal-meta">
              <p><strong>Asked by:</strong> {selected.user}</p>
              <p><strong>Time:</strong> {selected.time}</p>
              <p><strong>Category:</strong> {selected.category}</p>
              <p><strong>Replies:</strong> {selected.replies}</p>
              <p><strong>Likes:</strong> {selected.likes}</p>
            </div>
            <div className="modal-tags">
              <strong>Tags:</strong>
              {selected.tags.map((tag, idx) => (
                <span key={idx} className="tag">#{tag}</span>
              ))}
            </div>
            <div className="modal-details">
              <h3>Details:</h3>
              <p>{selected.details}</p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => handleLike(selected.id)}
                className="like-btn"
              >
                ❤️ {selected.likes}
              </button>
              <button 
                onClick={() => handleResolve(selected.id)}
                className={`resolve-btn ${selected.isResolved ? 'resolved' : ''}`}
              >
                {selected.isResolved ? '✅ Resolved' : '🔓 Mark Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
