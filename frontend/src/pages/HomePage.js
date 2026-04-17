// frontend/src/pages/HomePage.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postsComments, setPostsComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentingPost, setCommentingPost] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    API.get('/posts')
      .then(res => {
        setPosts(res.data);
        res.data.forEach(post => {
          API.get(`/comments/${post._id}`)
            .then(commentsRes => {
              setPostsComments(prev => ({
                ...prev,
                [post._id]: commentsRes.data
              }));
            })
            .catch(err => console.error(`Error fetching comments for post ${post._id}:`, err));
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }

    try {
      const response = await API.post(`/posts/${postId}/like`);
      const updatedPost = response.data.post;
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await API.post(`/comments/${postId}`, { body: newComment });
      setNewComment('');
      setCommentingPost(null);
      API.get(`/comments/${postId}`)
        .then(res => {
          setPostsComments(prev => ({
            ...prev,
            [postId]: res.data
          }));
        });
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.body.substring(0, 100) + '...',
        url: window.location.origin + `/posts/${post._id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/posts/${post._id}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-highlight">Let's Save</span>
              <br />
              Our Planet Together
            </h1>
            <p className="hero-subtitle">
              Join millions of eco-warriors making a difference. Every action counts in protecting our beautiful Earth.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                <span>🌱</span> Join the Movement
              </Link>
              <Link to="/about" className="btn-secondary">
                <span>📖</span> Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=600"
              alt="Earth from space"
              className="floating-earth"
            />
          </div>
        </div>
      </section>

      {/* MISSIONS SECTION */}
      <section className="missions-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Core Missions</h2>
            <p>Working together to create a sustainable future for generations to come</p>
          </div>

          <div className="missions-grid">
            <div className="mission-card">
              <div className="mission-icon">🌊</div>
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
                alt="Clean oceans"
                className="mission-image"
              />
              <h3>Clean Oceans</h3>
              <p>Reducing plastic pollution and protecting marine life through global initiatives and community action.</p>
              <Link to="/about" className="mission-link">Learn More →</Link>
            </div>

            <div className="mission-card">
              <div className="mission-icon">🌳</div>
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"
                alt="Reforestation"
                className="mission-image"
              />
              <h3>Reforestation</h3>
              <p>Planting millions of trees worldwide to combat climate change and restore natural habitats.</p>
              <Link to="/about" className="mission-link">Learn More →</Link>
            </div>

            <div className="mission-card">
              <div className="mission-icon">⚡</div>
              <img
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400"
                alt="Green energy"
                className="mission-image"
              />
              <h3>Green Energy</h3>
              <p>Transitioning to renewable energy sources to reduce carbon emissions and fight climate change.</p>
              <Link to="/about" className="mission-link">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="impact-section">
        <div className="container">
          <div className="impact-content">
            <div className="impact-text">
              <h2>Making a Real Difference</h2>
              <p>Since our founding, EcoGuardians has achieved remarkable milestones through collective action.</p>
              <div className="stats">
                <div className="stat">
                  <div className="stat-number">2.5M+</div>
                  <div className="stat-label">Trees Planted</div>
                </div>
                <div className="stat">
                  <div className="stat-number">500K+</div>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat">
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat">
                  <div className="stat-number">85%</div>
                  <div className="stat-label">Plastic Reduced</div>
                </div>
              </div>
            </div>
            <div className="impact-image">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500"
                alt="Environmental impact"
              />
            </div>
          </div>
        </div>
      </section>

      {/* POSTS SECTION */}
      <section className="posts-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Community Posts</h2>
            <p>Stay updated with the latest environmental news and stories from our community</p>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No posts yet</h3>
              <p>Be the first to share your environmental story!</p>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.slice(0, 6).map(post => (
                <article key={post._id} className="post-card">
                  {post.image && (
                    <div className="post-image">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`}
                        alt={post.title}
                      />
                    </div>
                  )}
                  <div className="post-content">
                    <h3>
                      <Link to={`/posts/${post._id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="post-excerpt">
                      {post.body.substring(0, 120)}...
                    </p>
                    <div className="post-meta">
                      <span className="author">👤 {post.author?.name}</span>
                      <span className="date">📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="post-actions">
                      <button 
                        className={`action-btn like-btn ${post.likes?.some(like => like._id === user?._id) ? 'liked' : ''}`}
                        onClick={() => handleLike(post._id)}
                        title={isAuthenticated ? 'Like this post' : 'Login to like posts'}
                      >
                        ❤️ {post.likes?.length || 0}
                      </button>
                      
                      <button 
                        className="action-btn comment-btn"
                        onClick={() => setCommentingPost(commentingPost === post._id ? null : post._id)}
                        title="Comment on this post"
                      >
                        💬 {postsComments[post._id]?.length || 0}
                      </button>
                      
                      <button 
                        className="action-btn share-btn"
                        onClick={() => handleShare(post)}
                        title="Share this post"
                      >
                        🔗 Share
                      </button>
                    </div>

                    {commentingPost === post._id && (
                      <form 
                        className="quick-comment-form"
                        onSubmit={(e) => handleCommentSubmit(e, post._id)}
                      >
                        {isAuthenticated ? (
                          <>
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              rows="2"
                              required
                            />
                            <div className="comment-actions">
                              <button type="submit" className="btn-comment">Post</button>
                              <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => {
                                  setCommentingPost(null);
                                  setNewComment('');
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="login-prompt">
                            <Link to="/login">Login</Link> to comment on posts
                          </div>
                        )}
                      </form>
                    )}

                    {(postsComments[post._id]?.length || 0) > 0 && commentingPost === post._id && (
                      <div className="comments-list">
                        <h5 className="comments-title">Comments ({postsComments[post._id]?.length})</h5>
                        {postsComments[post._id]?.map(comment => (
                          <div key={comment._id} className="comment-item">
                            <div className="comment-header">
                              <span className="comment-author">👤 {comment.author?.name}</span>
                              <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="comment-body">{comment.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-icon">🌿</div>
            <h2>Stay Updated with Eco News</h2>
            <p>Subscribe to our newsletter and get weekly updates on environmental initiatives</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join our community of environmental advocates and start your journey today.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary">
                <span>🚀</span> Sign Up Now
              </Link>
              <Link to="/entertainment" className="btn-secondary">
                <span>🎮</span> Take Our Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PINAGANDA NA FOOTER */}
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
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon"><i className="fab fa-facebook-f">📘</i></a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon"><i className="fab fa-twitter">🐦</i></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon"><i className="fab fa-instagram">📸</i></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon"><i className="fab fa-linkedin">🔗</i></a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-icon"><i className="fab fa-youtube">▶️</i></a>
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

export default HomePage;


