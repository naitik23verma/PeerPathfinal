import React from 'react';
import { motion } from 'framer-motion';
import './AdvancedFooter.css';

const developers = [
  {
    name: 'Naitik Verma',
    role: 'Full Stack Developer',
    github: 'https://github.com/naitik23verma',
    instagram: 'https://www.instagram.com/naitikverma9111',
    linkedin: 'https://www.linkedin.com/in/naitik-verma-869157318',
    avatar: '/Naitik.jpeg'
  },
  {
    name: 'Satyam Sharma',
    role: 'Full Stack Developer',
    github: 'https://github.com/Satyam-hacker49',
    instagram: 'https://www.instagram.com/satyam__sharmaa__',
    linkedin: 'https://www.linkedin.com/in/satyam-sharma-39a9ab324',
    avatar: '/Satyam.jpeg'
  }
];

const AdvancedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="advanced-footer">
      <div className="footer-content">
        <div className="footer-section">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="footer-title">
              Peer<span className="path-gradient">Path</span>
            </h3>
            <p className="footer-description">
              Connect, Collaborate, and Grow Together
            </p>
            <p className="footer-motto">
              Empowering students to build amazing projects and learn from each other.
            </p>
          </motion.div>
        </div>

        <div className="footer-section">
          <motion.div
            className="developers-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="footer-heading peerpath-solid-heading">Developed by</h3>
            <div className="developers-grid">
              {developers.map((dev, index) => (
                <motion.div
                  key={dev.name}
                  className="developer-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <img src={dev.avatar} alt={dev.name} className="developer-avatar" />
                  <div className="developer-info">
                    <h5 className="developer-name">{dev.name}</h5>
                    <p className="developer-role">{dev.role}</p>
                  </div>
                  <div className="social-links">
                    <motion.a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link github"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </motion.a>
                    <motion.a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link linkedin"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/>
                      </svg>
                    </motion.a>
                    <motion.a
                      href={dev.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link instagram"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.149 2.233 8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.048.014 8.328 0 8.736 0 12c0 3.264.014 3.672.073 4.952.2 4.358 2.622 6.776 6.98 6.976C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 4.358-.2 6.78-2.618 6.98-6.976.059-1.28.073-1.688.073-4.952 0-3.264-.014-3.672-.073-4.952-.2-4.358-2.622-6.776-6.98-6.976C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
                      </svg>
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="footer-section">
          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="footer-heading peerpath-solid-heading">Quick links</h3>
            <ul className="links-list">
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/doubts">Ask Questions</a></li>
              <li><a href="/collaboration">Collaborate</a></li>
              <li><a href="/resources">Resources</a></li>
              <li><a href="/location">Find Partners</a></li>
            </ul>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} PeerPath. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default AdvancedFooter;
