import React, { useState } from "react";
import "./AskDoubt.css";

export function AskDoubt({ currentUser, onDoubtSubmit, onCancel }) {
  const [doubtData, setDoubtData] = useState({
    question: "",
    details: "",
    category: "general",
    tags: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doubtData.question.trim()) return;

    const newDoubt = {
      id: Date.now(),
      question: doubtData.question,
      details: doubtData.details,
      category: doubtData.category,
      tags: doubtData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      user: currentUser?.name || "Anonymous",
      time: "Just now",
      replies: 0,
      likes: 0,
      isResolved: false
    };

    onDoubtSubmit(newDoubt);
    setDoubtData({
      question: "",
      details: "",
      category: "general",
      tags: ""
    });
  };

  const handleChange = (e) => {
    setDoubtData({
      ...doubtData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="ask-doubt-section">
      <div className="doubt-form-container">
        <form onSubmit={handleSubmit} className="doubt-form">
          <h2>Post a New Doubt</h2>
          <div className="form-group">
            <label htmlFor="question">Question *</label>
            <input
              type="text"
              id="question"
              name="question"
              value={doubtData.question}
              onChange={handleChange}
              placeholder="What's your question?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="details">Details</label>
            <textarea
              id="details"
              name="details"
              value={doubtData.details}
              onChange={handleChange}
              placeholder="Provide more context about your question..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={doubtData.category}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="programming">Programming</option>
                <option value="academics">Academics</option>
                <option value="career">Career</option>
                <option value="technology">Technology</option>
                <option value="study-tips">Study Tips</option>
                <option value="project-help">Project Help</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={doubtData.tags}
                onChange={handleChange}
                placeholder="react, javascript, dsa..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Ask Doubt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 