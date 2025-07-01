import React from 'react';
import emailjs from 'emailjs-com';
import "./Email.css"
function Footer() {
  const [suggestion, setSuggestion] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_oc9j5ws',         // Your EmailJS service ID
      'template_qkszgyo',        // Your EmailJS template ID
      e.target,
      'URmZf3Q1OWHqndVQZ'        // Your EmailJS user/public key
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
    <footer className="footer-review enhanced-footer">
      <div className="footer-container footer-modern">
        {/* ...other footer sections... */}
        <div className="footer-section writeus-section">
          <h2 className="footer-heading-orange">Write to us</h2>
          <form onSubmit={sendEmail} className="footer-write-form">
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
            />
            <button type="submit" className="footer-submit-btn">SUBMIT</button>
            {submitted && <div className="thank-you">Thank you for your message!</div>}
          </form>
        </div>
      </div>
    </footer>
  );
}

export default Footer;