// frontend/src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        <div className="app-footer-content">
          {/* Brand Section */}
          <div className="app-footer-section">
            <div className="app-footer-logo">
              <span className="logo-icon">🌿</span>
              <span className="logo-text">EcoGuardians</span>
            </div>
            <p className="app-footer-description">
              Protecting our planet, one action at a time. Join us in creating a sustainable future for generations to come.
            </p>
            <div className="app-footer-social">
              <a href="https://example.com" className="social-link" title="Facebook">📘</a>
              <a href="https://example.com" className="social-link" title="Twitter">🐦</a>
              <a href="https://example.com" className="social-link" title="Instagram">📷</a>
              <a href="https://example.com" className="social-link" title="YouTube">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="app-footer-section">
            <h3>Quick Links</h3>
            <ul className="app-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/entertainment">Eco Quiz</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="app-footer-section">
            <h3>Community</h3>
            <ul className="app-footer-links">
              <li><Link to="/home">Latest Posts</Link></li>
              <li><Link to="/create-post">Share Your Story</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><a href="#guidelines">Community Guidelines</a></li>
            </ul>
          </div>

          {/* Environmental Actions */}
          <div className="app-footer-section">
            <h3>Eco Actions</h3>
            <ul className="app-footer-links">
              <li><a href="#reduce">Reduce Waste</a></li>
              <li><a href="#recycle">Recycle More</a></li>
              <li><a href="#conserve">Conserve Energy</a></li>
              <li><a href="#plant">Plant Trees</a></li>
            </ul>
          </div>
        </div>

        {/* Environmental Message */}
        <div className="app-footer-environmental-message">
          <div className="earth-icon">🌍</div>
          <p>
            "The Earth does not belong to us. We belong to the Earth."
            <br />
            <em>- Chief Seattle</em>
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="app-footer-bottom">
          <div className="app-footer-bottom-content">
            <p>&copy; {currentYear} EcoGuardians. All rights reserved.</p>
            <div className="app-footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <span className="app-footer-separator">|</span>
              <a href="#terms">Terms of Service</a>
              <span className="app-footer-separator">|</span>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


