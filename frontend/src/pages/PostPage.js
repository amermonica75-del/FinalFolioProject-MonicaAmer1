import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './PostPage.css';

const PostPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await API.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    const loadComments = async () => {
      try {
        const response = await API.get(`/comments/${id}`);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    loadPost();
    loadComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await API.post(`/comments/${id}`, { body: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="post-page">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-page">
        <div className="error">
          <h2>Post Not Found</h2>
          <p>{error || 'The post you\'re looking for doesn\'t exist.'}</p>
          <Link to="/home" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-page">
      <article className="post-content">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="author">By {post.author?.name || 'Unknown Author'}</span>
            <span className="date">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </header>

        {post.image && (
          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <div className="post-body">
          <p>{post.body}</p>
        </div>

        <footer className="post-footer">
          <div className="post-tags">
            {post.tags && post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
          <div className="post-actions">
            <Link to="/home" className="btn btn-secondary">Back to Posts</Link>
          </div>
        </footer>
      </article>

      {/* COMMENTS SECTION */}
      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows="3"
              required
            />
            <button type="submit" className="btn btn-primary">Post Comment</button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please <Link to="/login">login</Link> to comment.</p>
          </div>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author?.name || 'Anonymous'}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="comment-body">
                  {comment.body}
                </div>
              </div>
            ))
          )}
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

export default PostPage;


