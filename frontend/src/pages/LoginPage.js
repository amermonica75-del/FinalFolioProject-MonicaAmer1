// frontend/src/pages/LoginPage.js

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ COMBINED handleSubmit (your code)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* HERO SECTION */}
      <section className="login-hero-section">
        <div className="login-hero-overlay"></div>
        <div className="login-hero-content">
          <h1 className="login-hero-title">
            Welcome Back to <span className="title-highlight">EcoGuardians</span>
          </h1>
          <p className="login-hero-subtitle">
            Sign in to continue your environmental journey and track your impact
          </p>
        </div>
      </section>

      {/* LOGIN FORM SECTION */}
      <section className="login-form-section">
        <div className="container">
          <div className="login-wrapper">
            <div className="login-card">
              <div className="login-header">
                <div className="login-icon">🌿</div>
                <h2>Login to Your Account</h2>
                <p>Access your dashboard and continue making a difference</p>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" /> 
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login to Account →'
                  )}
                </button>
              </form>

              <div className="login-footer">
                <p>
                  Don't have an account? <Link to="/register" className="register-link">Create an Account</Link>
                </p>
              </div>

              <div className="demo-credentials">
                <p className="demo-title">🔐 Demo Credentials:</p>
                <div className="demo-items">
                  <div className="demo-item">
                    <span className="demo-badge">User</span>
                    user@example.com / password123
                  </div>
                  <div className="demo-item">
                    <span className="demo-badge">Admin</span>
                    admin@example.com / admin123
                  </div>
                </div>
              </div>
            </div>

            {/* Side Features */}
            <div className="login-features">
              <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h3>Track Your Impact</h3>
                <p>Monitor your environmental contributions and see your progress over time</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>Earn Badges</h3>
                <p>Complete challenges and earn recognition for your eco-friendly actions</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3>Join Community</h3>
                <p>Connect with like-minded individuals and participate in events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="login-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>New to EcoGuardians?</h2>
            <p>Join our global community of environmental advocates today</p>
            <Link to="/register" className="btn-primary">
              🌱 Create Free Account
            </Link>
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

export default LoginPage;


