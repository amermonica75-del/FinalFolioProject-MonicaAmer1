// frontend/src/pages/RegisterPage.js

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    interest: "",
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (form.name.trim() === "") {
      newErrors.name = "Full Name is required";
      isValid = false;
    }

    if (form.username.trim() === "") {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
      isValid = false;
    }

    if (form.dob === "") {
      newErrors.dob = "Please select your date of birth";
      isValid = false;
    } else {
      const today = new Date();
      const birthDate = new Date(form.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old to join";
        isValid = false;
      } else if (age > 120) {
        newErrors.dob = "Please enter a valid date of birth";
        isValid = false;
      }
    }

    if (form.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (form.password === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
      isValid = false;
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!form.interest) {
      newErrors.interest = "Please select your interest level";
      isValid = false;
    }

    if (!form.terms) {
      newErrors.terms = "You must agree to the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // FIXED: Send ALL form fields to the backend
      const { data } = await API.post('/auth/register', {
        name: form.name,
        username: form.username,  // ADDED
        dob: form.dob,            // ADDED
        email: form.email,
        password: form.password,
        interest: form.interest   // ADDED
      });

      // Store token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Store user data if needed
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Show success message before redirect
      setTimeout(() => {
        navigate('/home');
      }, 500);
    } catch (err) {
      // Handle specific error cases
      if (err.response?.status === 409) {
        if (err.response.data.message.includes('email')) {
          setError('This email is already registered. Please use a different email or login.');
        } else if (err.response.data.message.includes('username')) {
          setError('This username is already taken. Please choose a different username.');
        } else {
          setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* HERO SECTION */}
      <section className="register-hero-section">
        <div className="register-hero-overlay"></div>
        <div className="register-hero-content">
          <h1 className="register-hero-title">Join the EcoGuardians Movement</h1>
          <p className="register-hero-subtitle">
            Become part of a global community dedicated to protecting our planet
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">150+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">2.5M+</span>
              <span className="stat-label">Trees Planted</span>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM SECTION */}
      <section className="register-form-section">
        <div className="container">
          <div className="register-wrapper">
            <div className="register-card">
              <div className="register-header">
                <div className="register-icon">🌱</div>
                <h2>Create Your Account</h2>
                <p>Join thousands of eco-warriors making a difference</p>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        className={errors.name ? 'error-input' : ''}
                        autoComplete="name"
                      />
                    </div>
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">Username *</label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="ecowarrior123"
                        value={form.username}
                        onChange={handleChange}
                        className={errors.username ? 'error-input' : ''}
                        autoComplete="username"
                      />
                    </div>
                    {errors.username && <span className="error-text">{errors.username}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth *</label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className={errors.dob ? 'error-input' : ''}
                      />
                    </div>
                    {errors.dob && <span className="error-text">{errors.dob}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="hello@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? 'error-input' : ''}
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Minimum 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        className={errors.password ? 'error-input' : ''}
                        autoComplete="new-password"
                      />
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error-input' : ''}
                        autoComplete="new-password"
                      />
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Interest Level *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="interest"
                        value="beginner"
                        checked={form.interest === "beginner"}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      🌱 Beginner - Just starting my eco journey
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="interest"
                        value="intermediate"
                        checked={form.interest === "intermediate"}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      🌿 Intermediate - Active environmentalist
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="interest"
                        value="expert"
                        checked={form.interest === "expert"}
                        onChange={handleChange}
                      />
                      <span className="radio-custom"></span>
                      🏆 Expert - Eco-warrior leader
                    </label>
                  </div>
                  {errors.interest && <span className="error-text">{errors.interest}</span>}
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={form.terms}
                      onChange={handleChange}
                    />
                    <span className="checkbox-custom"></span>
                    I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </label>
                  {errors.terms && <span className="error-text">{errors.terms}</span>}
                </div>

                <button type="submit" className="btn-register" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Join EcoGuardians →'
                  )}
                </button>

                <div className="register-footer">
                  <p>
                    Already have an account? <Link to="/login" className="login-link">Sign In</Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Side Benefits */}
            <div className="register-benefits">
              <div className="benefits-header">
                <h3>Why Join EcoGuardians?</h3>
                <p>Exclusive benefits for our members</p>
              </div>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🌍</div>
                  <div className="benefit-content">
                    <h4>Track Your Impact</h4>
                    <p>Monitor your environmental contributions and see real-world results</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🏅</div>
                  <div className="benefit-content">
                    <h4>Earn Badges & Rewards</h4>
                    <p>Complete challenges and earn recognition for your efforts</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">👥</div>
                  <div className="benefit-content">
                    <h4>Join Community Events</h4>
                    <p>Participate in local and global environmental initiatives</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">📚</div>
                  <div className="benefit-content">
                    <h4>Educational Resources</h4>
                    <p>Access exclusive guides, webinars, and learning materials</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🤝</div>
                  <div className="benefit-content">
                    <h4>Network with Experts</h4>
                    <p>Connect with environmental professionals and activists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="register-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Already an EcoGuardian?</h2>
            <p>Sign in to continue your environmental journey</p>
            <Link to="/login" className="btn-secondary">Sign In to Your Account</Link>
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
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">📘</a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">🐦</a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">📸</a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">🔗</a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon">▶️</a>
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

export default RegisterPage;

