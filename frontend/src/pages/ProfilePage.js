// frontend/src/pages/ProfilePage.js

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  
  console.log('ProfilePage rendered, user:', user);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log('Fetching posts for user:', user._id);
        const response = await API.get(`/posts/user/${user._id}`);
        console.log('User posts response:', response.data);
        setUserPosts(response.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        
        // If authentication error, try to refresh user data
        if (err.response?.status === 401) {
          console.log('Authentication error, trying to refresh user data');
          try {
            const refreshResponse = await API.get('/auth/me');
            console.log('Refreshed user data:', refreshResponse.data);
            // If successful, retry fetching posts
            const postsResponse = await API.get(`/posts/user/${user._id}`);
            setUserPosts(postsResponse.data);
          } catch (refreshErr) {
            console.error('Failed to refresh user data:', refreshErr);
          }
        }
      } finally {
        setPostsLoading(false);
      }
    };

    if (user && user._id) {
      console.log('User is authenticated:', user._id, user.name);
      setName(user.name || '');
      setBio(user.bio || '');
      fetchUserPosts();
    } else {
      console.log('User not authenticated or no user ID');
      setPostsLoading(false);
    }
  }, [user]);

  const handleEditPost = (post) => {
    setEditingPost(post._id);
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditImage(null);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditBody('');
    setEditImage(null);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const formData = new FormData();
    formData.append('title', editTitle.trim());
    formData.append('body', editBody.trim());
    if (editImage) formData.append('image', editImage);

    try {
      const response = await API.put(`/posts/${editingPost}`, formData);
      setUserPosts(userPosts.map(post => 
        post._id === editingPost ? response.data : post
      ));
      setMsg('Post updated successfully!');
      handleCancelEdit();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error('Error updating post:', err);
      setMsg('Failed to update post. Please try again.');
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setEditLoading(false);
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setPasswordLoading(true);
    
    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw
      });
      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error changing password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : `https://ui-avatars.com/api/?background=2E8B57&color=fff&bold=true&size=150&name=${encodeURIComponent(user?.name || 'User')}`;

  return (
    <div className="profile-page">
      {/* HERO SECTION */}
      <section className="profile-hero-section">
        <div className="profile-hero-overlay"></div>
        <div className="profile-hero-content">
          <div className="hero-icon">🌿</div>
          <h1 className="profile-hero-title">
            My <span className="title-highlight">Profile</span>
          </h1>
          <p className="profile-hero-subtitle">
            Manage your account settings and track your environmental impact
          </p>
        </div>
      </section>

      {/* PROFILE CONTENT SECTION */}
      <section className="profile-content-section">
        <div className="container">
          <div className="profile-wrapper">
            {/* Profile Sidebar */}
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <img src={picSrc} alt="Profile" className="avatar-image" />
                <div className="avatar-badge">
                  <span>🌿</span>
                </div>
              </div>
              <div className="profile-info">
                <h3>{user?.name || 'EcoGuardian'}</h3>
                <p className="user-email">{user?.email || 'user@example.com'}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-value">🌍</span>
                    <span className="stat-label">Eco Score</span>
                    <span className="stat-number">1,250</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">🏆</span>
                    <span className="stat-label">Badges</span>
                    <span className="stat-number">8</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">🌱</span>
                    <span className="stat-label">Level</span>
                    <span className="stat-number">Gold</span>
                  </div>
                </div>
              </div>
              
              <div className="sidebar-footer">
                <p>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="profile-main">
              {msg && (
                <div className={`message-alert ${msg.includes('successfully') ? 'success' : 'error'}`}>
                  <span className="message-icon">{msg.includes('successfully') ? '✓' : '⚠️'}</span>
                  <span className="message-text">{msg}</span>
                  <button className="message-close" onClick={() => setMsg('')}>×</button>
                </div>
              )}

              {/* Edit Profile Form */}
              <div className="profile-card">
                <div className="card-header">
                  <div className="card-icon-wrapper">
                    <div className="card-icon">✏️</div>
                  </div>
                  <div className="card-title-wrapper">
                    <h2>Edit Profile</h2>
                    <p>Update your personal information</p>
                  </div>
                </div>
                
                <form onSubmit={handleProfile} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">
                      Display Name <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon"></span>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your display name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <div className="input-wrapper">
                      <span className="input-icon"></span>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself and your eco-journey..."
                        rows={4}
                      />
                    </div>
                    <div className="input-hint">
                      <span>{bio.length}/200 characters</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="profilePic">Profile Picture</label>
                    <div className="file-input-wrapper">
                      <label htmlFor="profilePic" className="file-label">
                        <span className="file-icon"></span>
                        Choose an image
                        <span className="file-hint">(JPG, PNG, GIF up to 5MB)</span>
                      </label>
                      <input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPic(e.target.files[0])}
                        className="file-input"
                      />
                    </div>
                    {pic && (
                      <div className="file-info">
                        <span className="file-info-icon">✅</span>
                        Selected: {pic.name}
                        <button 
                          type="button" 
                          className="file-clear"
                          onClick={() => {
                            setPic(null);
                            document.getElementById('profilePic').value = '';
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <span>💚</span>
                        Save Profile Changes
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Change Password Form */}
              <div className="profile-card">
                <div className="card-header">
                  <div className="card-icon-wrapper">
                    <div className="card-icon">🔒</div>
                  </div>
                  <div className="card-title-wrapper">
                    <h2>Change Password</h2>
                    <p>Update your password to keep your account secure</p>
                  </div>
                </div>
                
                <form onSubmit={handlePassword} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                        value={curPw}
                        onChange={(e) => setCurPw(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <span className="input-icon"> </span>
                      <input
                        id="newPassword"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div className={`strength-fill ${newPw.length >= 6 ? 'weak' : ''}`}></div>
                      </div>
                      <span className="password-hint">
                        {newPw.length === 0 ? 'Enter a new password' : 
                         newPw.length < 6 ? 'Password must be at least 6 characters' : 
                         '✓ Strong enough'}
                      </span>
                    </div>
                  </div>

                  <button type="submit" className="btn-submit btn-secondary" disabled={passwordLoading}>
                    {passwordLoading ? (
                      <>
                        <span className="spinner"></span>
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <span>🔐</span>
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Eco Impact Stats */}
              <div className="profile-card impact-card">
                <div className="card-header">
                  <div className="card-icon-wrapper">
                    <div className="card-icon">🌍</div>
                  </div>
                  <div className="card-title-wrapper">
                    <h2>Your Eco Impact</h2>
                    <p>Track your contributions to the planet</p>
                  </div>
                </div>
                
                <div className="impact-stats">
                  <div className="impact-stat">
                    <div className="impact-number">12</div>
                    <div className="impact-label">Trees Planted</div>
                    <div className="impact-trend">↑ +2 this month</div>
                  </div>
                  <div className="impact-stat">
                    <div className="impact-number">345</div>
                    <div className="impact-label">Carbon Saved (kg)</div>
                    <div className="impact-trend">↑ +45 this month</div>
                  </div>
                  <div className="impact-stat">
                    <div className="impact-number">5</div>
                    <div className="impact-label">Challenges</div>
                    <div className="impact-trend">Completed this year</div>
                  </div>
                </div>
                
                <Link to="/dashboard" className="impact-link">
                  View Full Dashboard
                  <span className="link-arrow">→</span>
                </Link>
              </div>

              {/* Activity Feed */}
              <div className="profile-card activity-card">
                <div className="card-header">
                  <div className="card-icon-wrapper">
                    <div className="card-icon">📊</div>
                  </div>
                  <div className="card-title-wrapper">
                    <h2>Recent Activity</h2>
                    <p>Your latest contributions</p>
                  </div>
                </div>
                
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">🌳</div>
                    <div className="activity-details">
                      <p className="activity-text">Joined tree planting event</p>
                      <span className="activity-date">2 days ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">♻️</div>
                    <div className="activity-details">
                      <p className="activity-text">Completed recycling challenge</p>
                      <span className="activity-date">5 days ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-details">
                      <p className="activity-text">Shared a community post</p>
                      <span className="activity-date">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Posts Section */}
              <div className="profile-card posts-card">
                <div className="card-header">
                  <div className="card-icon-wrapper">
                    <div className="card-icon">📝</div>
                  </div>
                  <div className="card-title-wrapper">
                    <h2>My Posts</h2>
                    <p>Your published community posts</p>
                  </div>
                </div>
                
                <div className="posts-content">
                  {console.log('Rendering posts, loading:', postsLoading, 'posts count:', userPosts.length)}
                  {postsLoading ? (
                    <div className="loading-posts">
                      <div className="spinner"></div>
                      <p>Loading your posts...</p>
                    </div>
                  ) : userPosts.length === 0 ? (
                    <div className="no-posts">
                      <div className="no-posts-icon">📝</div>
                      <h3>No posts yet</h3>
                      <p>You haven't published any posts yet. Share your environmental story!</p>
                      <Link to="/create-post" className="btn-primary">
                        <span>✏️</span> Create Your First Post
                      </Link>
                      {/* Debug: Show all posts temporarily */}
                      <button 
                        onClick={async () => {
                          try {
                            console.log('Fetching all posts for debugging...');
                            const response = await API.get('/posts');
                            console.log('All posts:', response.data);
                            setUserPosts(response.data);
                          } catch (err) {
                            console.error('Error fetching all posts:', err);
                          }
                        }}
                        style={{ marginTop: '10px', padding: '8px 16px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        Debug: Show All Posts
                      </button>
                    </div>
                  ) : (
                    <div className="user-posts-grid">
                      {userPosts.map(post => (
                        <article key={post._id} className="user-post-card">
                          {editingPost === post._id ? (
                            // Edit Form
                            <form onSubmit={handleUpdatePost} className="edit-post-form">
                              <div className="form-group">
                                <label>Title</label>
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  required
                                  maxLength="200"
                                />
                              </div>
                              
                              <div className="form-group">
                                <label>Content</label>
                                <textarea
                                  value={editBody}
                                  onChange={(e) => setEditBody(e.target.value)}
                                  rows="4"
                                  required
                                />
                              </div>
                              
                              <div className="form-group">
                                <label>Update Image (optional)</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setEditImage(e.target.files[0])}
                                />
                              </div>
                              
                              <div className="edit-actions">
                                <button type="submit" className="btn-save" disabled={editLoading}>
                                  {editLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            // Post Display
                            <>
                              {post.image && (
                                <div className="post-image">
                                  <img
                                    src={`http://localhost:5000/uploads/${post.image}`}
                                    alt={post.title}
                                  />
                                </div>
                              )}
                              <div className="post-content">
                                <h4>
                                  <Link to={`/posts/${post._id}`}>
                                    {post.title}
                                  </Link>
                                </h4>
                                <p className="post-excerpt">
                                  {post.body.substring(0, 100)}...
                                </p>
                                <div className="post-meta">
                                  <span className="post-date">
                                    📅 {new Date(post.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className="post-likes">
                                    ❤️ {post.likes?.length || 0} likes
                                  </span>
                                </div>
                                <div className="post-actions">
                                  <button 
                                    className="btn-edit"
                                    onClick={() => handleEditPost(post)}
                                    title="Edit this post"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <Link 
                                    to={`/posts/${post._id}`}
                                    className="btn-view"
                                  >
                                    👁️ View
                                  </Link>
                                </div>
                              </div>
                            </>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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

export default ProfilePage;


