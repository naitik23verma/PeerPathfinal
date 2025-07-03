import React from 'react';
import emailjs from 'emailjs-com';
import "./Email.css"
import Rating from "./components/Rating.jsx";

function Email({ showRating, compact, currentUser }) {
  const [suggestion, setSuggestion] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_oc9j5ws',
      'template_qkszgyo',
      e.target,
      'URmZf3Q1OWHqndVQZ'
    ).then((result) => {
        setSubmitted(true);
        setName("");
        setEmail("");
        setSuggestion("");
        window.alert('Feedback sent!');
    }, (error) => {
        alert('Failed to send. Please try again.');
    });
    e.target.reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div
      className="emailjs-form-mobile"
      style={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        background: 'rgba(20, 20, 40, 0.7)',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(60, 60, 120, 0.10)',
        padding: compact ? '1.2rem 1rem 1rem 1rem' : '2.5rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: compact ? 320 : undefined,
      }}
    >
      <h2 style={{
        color: '#c7b5fd',
        fontWeight: 700,
        fontSize: '2rem',
        textAlign: 'center',
        marginBottom: compact ? '1rem' : '1.5rem',
        letterSpacing: '0.5px',
      }}>Write to us</h2>
      <form onSubmit={sendEmail} className="footer-write-form" style={{ width: '100%' }}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Fullname"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <textarea
          name="message"
          value={suggestion}
          onChange={e => setSuggestion(e.target.value)}
          placeholder="Message"
          required
          style={compact ? { minHeight: 50, maxHeight: 100 } : {}}
        />
        <button type="submit" className="footer-submit-btn">SUBMIT</button>
        {submitted && <div className="thank-you">Thank you for your message!</div>}
      </form>
      {showRating && <Rating simple={true} />}
    </div>
  );
}

export default Email;