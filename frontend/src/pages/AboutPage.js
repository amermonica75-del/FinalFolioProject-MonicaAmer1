// frontend/src/pages/AboutPage.js

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const [counters, setCounters] = useState({
    trees: 0,
    volunteers: 0,
    countries: 0,
    projects: 0
  });

  // Animation for counters
  useEffect(() => {
    const targets = {
      trees: 125000,
      volunteers: 15000,
      countries: 50,
      projects: 320
    };

    const duration = 2000;
    const steps = 60;
    const increment = {
      trees: targets.trees / steps,
      volunteers: targets.volunteers / steps,
      countries: targets.countries / steps,
      projects: targets.projects / steps
    };

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps) {
        setCounters({
          trees: Math.min(Math.floor(increment.trees * currentStep), targets.trees),
          volunteers: Math.min(Math.floor(increment.volunteers * currentStep), targets.volunteers),
          countries: Math.min(Math.floor(increment.countries * currentStep), targets.countries),
          projects: Math.min(Math.floor(increment.projects * currentStep), targets.projects)
        });
        currentStep++;
      } else {
        setCounters(targets);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  const teamMembers = [
    { name: "Dr. Sarah Johnson", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/women/68.jpg", bio: "Environmental scientist with 15+ years experience", social: { linkedin: "#", twitter: "#" } },
    { name: "Michael Chen", role: "Operations Director", image: "https://randomuser.me/api/portraits/men/32.jpg", bio: "Expert in sustainable development and logistics", social: { linkedin: "#", twitter: "#" } },
    { name: "Emma Rodriguez", role: "Community Lead", image: "https://randomuser.me/api/portraits/women/44.jpg", bio: "Passionate about grassroots movements and education", social: { linkedin: "#", twitter: "#" } },
    { name: "David Kim", role: "Tech Innovation", image: "https://randomuser.me/api/portraits/men/91.jpg", bio: "Building technology solutions for environmental good", social: { linkedin: "#", twitter: "#" } }
  ];

  const achievements = [
    { icon: "🌳", title: "Trees Planted", value: `${counters.trees.toLocaleString()}+`, description: "Across 6 continents", color: "#4ade80" },
    { icon: "👥", title: "Active Volunteers", value: `${counters.volunteers.toLocaleString()}+`, description: "Growing daily", color: "#60a5fa" },
    { icon: "🌍", title: "Countries Reached", value: `${counters.countries}+`, description: "Global presence", color: "#fbbf24" },
    { icon: "🎯", title: "Projects Completed", value: `${counters.projects}+`, description: "And counting", color: "#f472b6" }
  ];

  const partners = [
    { name: "Greenpeace", logo: "https://placehold.co/150x80/2d6a4f/white?text=Greenpeace", description: "Global environmental network" },
    { name: "WWF", logo: "https://placehold.co/150x80/2d6a4f/white?text=WWF", description: "Wildlife conservation" },
    { name: "UN Environment", logo: "https://placehold.co/150x80/2d6a4f/white?text=UNEP", description: "United Nations program" },
    { name: "TreeNation", logo: "https://placehold.co/150x80/2d6a4f/white?text=TreeNation", description: "Global reforestation" }
  ];

  const faqs = [
    { question: "How can I volunteer?", answer: "Simply register on our platform and choose from available projects near you." },
    { question: "Is there any fee to join?", answer: "No, joining EcoGuardians is completely free! We believe everyone should have access to environmental action." },
    { question: "How are donations used?", answer: "90% of donations go directly to tree planting and conservation projects. We maintain transparency in all our operations." },
    { question: "Can I start a project in my area?", answer: "Absolutely! Contact our team, and we'll help you set up a local initiative." }
  ];

  const recentUpdates = [
    { date: "March 15, 2026", title: "Planted 10,000 trees in Amazon", type: "Milestone", icon: "🌳" },
    { date: "March 10, 2026", title: "New partnership with WWF", type: "Partnership", icon: "🤝" },
    { date: "March 5, 2026", title: "Launched mobile app", type: "Launch", icon: "📱" },
    { date: "February 28, 2026", title: "Reached 50 countries", type: "Achievement", icon: "🏆" }
  ];

  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <section className="about-hero-section">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">Our Environmental Journey</h1>
          <p className="about-hero-subtitle">
            Empowering the world to grow greener every day.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="hero-btn-primary">Join Our Mission →</Link>
            <Link to="/projects" className="hero-btn-secondary">View Our Work</Link>
          </div>
        </div>
      </section>

      {/* STATS COUNTER SECTION */}
      <section className="stats-counter-section">
        <div className="container">
          <div className="stats-grid">
            {achievements.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="about-mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                EcoGuardians was founded on the simple idea that technology should serve the planet.
                We believe in a greener future where digital advocacy leads to physical transformation.
                Our goal is to provide a platform where every individual can contribute to global
                reforestation and conservation efforts.
              </p>
              <div className="mission-features">
                <div className="feature">
                  <span className="feature-icon">🎯</span>
                  <span>Clear Impact Metrics</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🌱</span>
                  <span>Sustainable Practices</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🤝</span>
                  <span>Community First</span>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500"
                alt="Environmental conservation"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Trusted Partners</h2>
            <p>Working together for a sustainable future</p>
          </div>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div className="partner-card" key={index}>
                <img src={partner.logo} alt={partner.name} />
                <h4>{partner.name}</h4>
                <p>{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORY TIMELINE SECTION */}
      <section className="about-timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>History & Growth</h2>
            <p>Our journey towards a sustainable future</p>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <div className="timeline-content">
                <h3>The Humble Beginning</h3>
                <p>We started as a small community group organizing local beach cleanups and raising awareness about environmental issues.</p>
                <span className="timeline-tag">First milestone</span>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-content">
                <h3>Global Partnerships</h3>
                <p>Partnered with global tree-planting NGOs and expanded our reach to 50+ countries worldwide.</p>
                <span className="timeline-tag">50+ countries</span>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">2026</div>
              <div className="timeline-content">
                <h3>Digital Expansion</h3>
                <p>Launched this platform to reach thousands of volunteers and make environmental action accessible to everyone.</p>
                <span className="timeline-tag">Digital transformation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT UPDATES SECTION */}
      <section className="updates-section">
        <div className="container">
          <div className="section-header">
            <h2>Recent Updates</h2>
            <p>What's happening at EcoGuardians</p>
          </div>
          <div className="updates-list">
            {recentUpdates.map((update, index) => (
              <div className="update-item" key={index}>
                <div className="update-icon">{update.icon}</div>
                <div className="update-content">
                  <div className="update-date">{update.date}</div>
                  <h4>{update.title}</h4>
                  <span className="update-type">{update.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Leadership</h2>
            <p>The passionate team behind EcoGuardians</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                  <div className="team-social">
                    <a href={member.social.linkedin}>🔗</a>
                    <a href={member.social.twitter}>🐦</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div className="faq-card" key={index}>
                <h3>❓ {faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="about-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Movement</h2>
            <p>Be part of the change. Together, we can make a difference.</p>
            <div className="cta-stats">
              <span>✨ 15,000+ Volunteers</span>
              <span>🌱 125,000+ Trees Planted</span>
              <span>🌍 50+ Countries</span>
            </div>
            <Link to="/register" className="btn-primary">Get Started Today</Link>
          </div>
        </div>
      </section>

      {/* PREMIUM FOOTER SECTION - ITO LANG ANG BAGO */}
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
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">📘</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon">🐦</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">📸</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">🔗</a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon">▶️</a>
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

export default AboutPage;


