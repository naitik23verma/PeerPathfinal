import React, { useState } from "react";
import axios from "axios";
import "./AskDoubt.css";

export function AskDoubt({ currentUser, onDoubtSubmit, onCancel }) {
  const [doubtData, setDoubtData] = useState({
    question: "",
    details: "",
    category: "general",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doubtData.question.trim()) {
      setError("Question is required");
      return;
    }
    if (!doubtData.details.trim()) {
      setError("Details are required");
      return;
    }
    if (!doubtData.category || doubtData.category === "") {
      setError("Category is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const doubtPayload = {
        title: doubtData.question,
        content: doubtData.details,
        category: doubtData.category,
        tags: doubtData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await axios.post('http://localhost:5000/api/doubts', doubtPayload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.doubt) {
        onDoubtSubmit(response.data.doubt);
    setDoubtData({
      question: "",
      details: "",
      category: "general",
      tags: ""
    });
        setError("");
      }
    } catch (error) {
      console.error('Error submitting doubt:', error);
      setError(error.response?.data?.message || 'Failed to submit doubt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDoubtData({
      ...doubtData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="ask-doubt-section">
      <div className="doubt-form-container">
        <form onSubmit={handleSubmit} className="doubt-form">
          <h2>Post a New Doubt</h2>
          
          {error && <div className="error-message">{error}</div>}
          
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
              disabled={loading}
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
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel} 
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Ask Doubt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 