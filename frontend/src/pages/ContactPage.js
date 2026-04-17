// frontend/src/pages/ContactPage.js

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'cName' ? 'name' : id === 'cEmail' ? 'email' : 'message']: value
    }));
  };

  const validateContact = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    let newErrors = {
      name: name.trim() === "" ? "⚠ Name is required" : "",
      email: !email.includes("@") || email.trim() === "" ? "⚠ Valid email required" : "",
      message: message.length < 10 ? "⚠ Message must be at least 10 characters" : ""
    };

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      setIsSubmitted(true);
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="contact-page">
      {/* HERO SECTION */}
      <section className="contact-hero-section">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-subtitle">
            Have questions about our mission or want to volunteer? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              <p className="form-subtitle">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              
              {isSubmitted && (
                <div className="success-message">
                  ✓ Message sent successfully! We'll contact you soon.
                </div>
              )}
              
              <form onSubmit={validateContact}>
                <div className="form-group">
                  <label htmlFor="cName">Full Name *</label>
                  <input 
                    type="text" 
                    id="cName" 
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error-input' : ''}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cEmail">Email Address *</label>
                  <input 
                    type="email" 
                    id="cEmail" 
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error-input' : ''}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cMessage">Message *</label>
                  <textarea 
                    id="cMessage" 
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error-input' : ''}
                  ></textarea>
                  {errors.message && <span className="error">{errors.message}</span>}
                </div>

                <button type="submit" className="btn-submit">Send Message</button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-container">
              <div className="info-card">
                <h3>📍 Visit Us</h3>
                <p>123 Nature Reserve Way<br />California, USA 90210</p>
              </div>
              
              <div className="info-card">
                <h3>📧 Email Us</h3>
                <p>hello@ecoguardians.org<br />support@ecoguardians.org</p>
              </div>
              
              <div className="info-card">
                <h3>📞 Call Us</h3>
                <p>+1 (555) 123-4567<br />Mon-Fri, 9am-6pm PST</p>
              </div>
              
              <div className="info-card">
                <h3>💬 Social Media</h3>
                <div className="social-links">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🌐 Twitter</a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONAL RESOURCES SECTION */}
      <section className="resources-section">
        <div className="container">
          <div className="section-header">
            <h2>Regional Resources</h2>
            <p>Find environmental resources and support in your region</p>
          </div>
          
          <div className="resources-table-container">
            <table className="resources-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Resource Link</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Region">🌎 North America</td>
                  <td data-label="Resource">Eco-Center CA</td>
                  <td data-label="Availability">24/7 Support</td>
                  <td data-label="Action"><a href="https://example.com" className="resource-link">Visit →</a></td>
                </tr>
                <tr>
                  <td data-label="Region">🌏 Europe</td>
                  <td data-label="Resource">Green Hub Berlin</td>
                  <td data-label="Availability">Mon-Fri, 9-5 GMT</td>
                  <td data-label="Action"><a href="https://example.com" className="resource-link">Visit →</a></td>
                </tr>
                <tr>
                  <td data-label="Region">🌏 Asia Pacific</td>
                  <td data-label="Resource">Eco Alliance Tokyo</td>
                  <td data-label="Availability">24/7 Chat Support</td>
                  <td data-label="Action"><a href="https://example.com" className="resource-link">Visit →</a></td>
                </tr>
                <tr>
                  <td data-label="Region">🌍 Global</td>
                  <td data-label="Resource">WWF Partner Portal</td>
                  <td data-label="Availability">Online Chat 24/7</td>
                  <td data-label="Action"><a href="https://example.com" className="resource-link">Visit →</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MAP LOCATION SECTION */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Global Headquarters</h2>
            <p>Visit our main office or find a location near you</p>
          </div>
          
          <div className="map-container">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
              alt="Map Location"
              className="map-image"
            />
            <div className="map-overlay">
              <div className="map-marker">📍</div>
              <div className="map-text">
                <strong>EcoGuardians Headquarters</strong><br />
                123 Nature Reserve Way, California, USA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="contact-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Join the Movement?</h2>
            <p>Become an EcoGuardian today and help protect our planet.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary">Sign Up Now</Link>
              <Link to="/about" className="btn-secondary">Learn About Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM FOOTER - ITO LANG ANG DINAGDAG KO */}
      <footer className="premium-footer">
        <div className="footer-waves">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#0d2818" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,186.7C672,192,768,224,864,234.7C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              {/* Brand Section */}
              <div className="footer-brand">
                <div className="footer-logo">
                  <span className="logo-icon">🌍</span>
                  <span className="logo-text">EcoGuardians</span>
                </div>
                <p>Empowering a greener future through technology and collective action. Together, we can save our planet.</p>
                <div className="footer-social">
                  <a href="https://example.com" className="social-icon">📘</a>
                  <a href="https://example.com" className="social-icon">🐦</a>
                  <a href="https://example.com" className="social-icon">📸</a>
                  <a href="https://example.com" className="social-icon">🔗</a>
                  <a href="https://example.com" className="social-icon">▶️</a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/">🏠 Home</Link></li>
                  <li><Link to="/about">📖 About Us</Link></li>
                  <li><Link to="/contact">📞 Contact</Link></li>
                  <li><Link to="/blog">📝 Blog</Link></li>
                </ul>
              </div>

              {/* Programs */}
              <div className="footer-links">
                <h4>Our Programs</h4>
                <ul>
                  <li><Link to="/tree-planting">🌳 Tree Planting</Link></li>
                  <li><Link to="/cleanups">🗑️ Cleanup Drives</Link></li>
                  <li><Link to="/education">📚 Education</Link></li>
                  <li><Link to="/volunteer">🙋 Volunteer</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="footer-contact">
                <h4>Get in Touch</h4>
                <ul>
                  <li>📧 <a href="mailto:info@ecoguardians.org">info@ecoguardians.org</a></li>
                  <li>📞 <a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                  <li>📍 123 Green Street, Eco City, Earth 12345</li>
                </ul>
                <div className="newsletter-mini">
                  <p>Subscribe to our newsletter:</p>
                  <div className="newsletter-input-group">
                    <input type="email" placeholder="Your email" />
                    <button>→</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2024 EcoGuardians. All rights reserved. | Protecting our planet, one step at a time.</p>
              <div className="footer-legal">
                <Link to="/privacy">Privacy Policy</Link>
                <span className="separator">|</span>
                <Link to="/terms">Terms of Service</Link>
                <span className="separator">|</span>
                <Link to="/cookies">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;


