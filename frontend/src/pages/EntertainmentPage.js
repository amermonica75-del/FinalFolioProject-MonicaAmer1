// frontend/src/pages/EntertainmentPage.js

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './EntertainmentPage.css';

const EntertainmentPage = () => {
  const items = [
    { text: "Using a reusable water bottle", isEco: true },
    { text: "Leaving the tap running while brushing teeth", isEco: false },
    { text: "Planting native flowers for bees", isEco: true },
    { text: "Throwing plastic into the regular trash", isEco: false },
    { text: "Buying locally grown vegetables", isEco: true },
    { text: "Using a dryer instead of air-drying clothes", isEco: false },
    { text: "Turning off electronics at night", isEco: true },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleAnswer = (isEco) => {
    setSelectedAnswer(isEco);
    const isCorrect = isEco === items[currentIndex].isEco;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('✅ Correct! Great job!');
    } else {
      setFeedback('❌ Oops! That\'s not quite right. Keep learning!');
    }
    
    setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setFeedback('');
      } else {
        setShowResult(true);
        setFeedback('');
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setFeedback('');
  };

  const getEcoTip = () => {
    const tips = [
      "💡 Did you know? Turning off lights saves energy!",
      "🌱 Plant a tree today for a better tomorrow!",
      "♻️ Reduce, Reuse, Recycle - in that order!",
      "💧 Save water - every drop counts!",
      "🚶 Walk or bike to reduce carbon emissions!",
      "🥤 Say no to single-use plastics!",
      "🔌 Unplug electronics when not in use!"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="entertainment-page">
      {/* HERO SECTION */}
      <section className="entertainment-hero-section">
        <div className="entertainment-hero-overlay"></div>
        <div className="entertainment-hero-content">
          <h1 className="entertainment-hero-title">
            🌿 EcoGuardians Quiz Challenge
          </h1>
          <p className="entertainment-hero-subtitle">
            Test your knowledge and learn how to protect our planet!
          </p>
          <div className="hero-badge">
            🌟 Test Your Eco Knowledge 🌟
          </div>
        </div>
      </section>

      {/* QUIZ SECTION */}
      <section className="quiz-section">
        <div className="container">
          <div className="quiz-wrapper">
            {!showResult ? (
              <>
                <div className="quiz-header">
                  <div className="progress-info">
                    <span className="question-counter">
                      Question {currentIndex + 1} of {items.length}
                    </span>
                    <span className="score-display">
                      Score: {score} / {items.length}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="quiz-card">
                  <div className="quiz-question">
                    {items[currentIndex].text}
                  </div>
                  {feedback && (
                    <div className={`feedback-message ${feedback.includes('Correct') ? 'feedback-correct' : 'feedback-wrong'}`}>
                      {feedback}
                    </div>
                  )}
                </div>
                
                <div className="quiz-buttons">
                  <button 
                    className="btn-eco"
                    onClick={() => handleAnswer(true)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="btn-icon">✅</span>
                    Eco-Friendly
                  </button>
                  
                  <button 
                    className="btn-not-eco"
                    onClick={() => handleAnswer(false)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="btn-icon">❌</span>
                    Not Eco-Friendly
                  </button>
                </div>

                <div className="eco-tip">
                  <p>{getEcoTip()}</p>
                </div>
              </>
            ) : (
              <div className="result-container">
                <div className="result-icon">
                  {score >= items.length * 0.7 ? '🏆' : score >= items.length * 0.5 ? '🌱' : '💚'}
                </div>
                <h2 className="result-title">Quiz Complete!</h2>
                <div className="final-score">
                  <div className="score-circle">
                    <span className="score-number">{score}</span>
                    <span className="score-total">/{items.length}</span>
                  </div>
                </div>
                <p className="result-message">
                  {score >= items.length * 0.7 ? 
                    "Excellent! You're a true Eco-Warrior! 🌍✨ Keep inspiring others with your environmental knowledge!" : 
                    score >= items.length * 0.5 ? 
                    "Good job! You're on the right track! 🌱 Keep learning and growing your eco-awareness!" : 
                    "Great start! Every eco-action counts! ♻️ Take the quiz again to learn more!"}
                </p>
                <div className="result-stats">
                  <div className="stat-item">
                    <span className="stat-label">Correct Answers</span>
                    <span className="stat-value">{score}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Incorrect Answers</span>
                    <span className="stat-value">{items.length - score}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Accuracy</span>
                    <span className="stat-value">{Math.round((score / items.length) * 100)}%</span>
                  </div>
                </div>
                <div className="result-buttons">
                  <button className="btn-play-again" onClick={resetGame}>
                    🔄 Play Again
                  </button>
                  <Link to="/register" className="btn-join">
                    🌿 Join EcoGuardians
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ECO TIPS SECTION */}
      <section className="eco-tips-section">
        <div className="container">
          <div className="section-header">
            <h2>Simple Eco-Friendly Actions</h2>
            <p>Small changes make a big difference for our planet</p>
          </div>
          
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💧</div>
              <h3>Save Water</h3>
              <p>Take shorter showers and fix leaks to conserve water.</p>
            </div>
            
            <div className="tip-card">
              <div className="tip-icon">🔌</div>
              <h3>Unplug Electronics</h3>
              <p>Devices use energy even when off. Unplug when not in use.</p>
            </div>
            
            <div className="tip-card">
              <div className="tip-icon">🛍️</div>
              <h3>Bring Your Own Bag</h3>
              <p>Reduce plastic waste by using reusable shopping bags.</p>
            </div>
            
            <div className="tip-card">
              <div className="tip-icon">🚲</div>
              <h3>Walk or Bike</h3>
              <p>Choose eco-friendly transportation to reduce emissions.</p>
            </div>
            
            <div className="tip-card">
              <div className="tip-icon">🥗</div>
              <h3>Eat Local</h3>
              <p>Support local farmers and reduce food transportation emissions.</p>
            </div>
            
            <div className="tip-card">
              <div className="tip-icon">♻️</div>
              <h3>Recycle Properly</h3>
              <p>Learn what can be recycled in your area and sort waste correctly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE SECTION */}
      <section className="challenge-section">
        <div className="container">
          <div className="challenge-content">
            <div className="challenge-text">
              <h2>Ready for a 30-Day Eco Challenge?</h2>
              <p>Join thousands of EcoGuardians taking daily actions to protect our planet. Complete challenges, earn badges, and track your environmental impact!</p>
              <Link to="/register" className="btn-challenge">
                Start Your Challenge →
              </Link>
            </div>
            <div className="challenge-stats">
              <div className="challenge-stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Challengers</div>
              </div>
              <div className="challenge-stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Actions Taken</div>
              </div>
              <div className="challenge-stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="entertainment-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Become an EcoGuardian Today!</h2>
            <p>Join our community and make a real difference for our planet.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary">Sign Up Free</Link>
              <Link to="/about" className="btn-secondary">Learn More</Link>
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

export default EntertainmentPage;


