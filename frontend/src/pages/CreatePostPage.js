// frontend/src/pages/CreatePostPage.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './CreatePostPage.css';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only image files are allowed (jpg, png, gif, webp)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      setLoading(false);
      return;
    }
    if (!body.trim()) {
      setError('Please enter post content');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('body', body.trim());
    if (image) formData.append('image', image);

    try {
      const response = await API.post('/posts', formData);
      console.log('Create post response:', response.data);
      
      setSuccess('Post created successfully! Redirecting to homepage...');
      
      // Redirect to homepage after 1.5 seconds
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      console.error('Create post error full:', err);
      console.error('Create post error response:', err.response?.data);
      const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create post';
      console.log('Final error message shown to user:', message);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      {/* HERO SECTION */}
      <section className="create-post-hero-section">
        <div className="create-post-hero-overlay"></div>
        <div className="create-post-hero-content">
          <div className="hero-icon">✍️</div>
          <h1 className="create-post-hero-title">
            Create New <span className="title-highlight">Post</span>
          </h1>
          <p className="create-post-hero-subtitle">
            Share your thoughts and inspire the community
          </p>
        </div>
      </section>

      {/* CREATE POST FORM SECTION */}
      <section className="create-post-form-section">
        <div className="container">
          <div className="create-post-wrapper">
            <div className="create-post-card">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="close-btn">×</button>
                </div>
              )}

              {success && (
                <div className="success-message">
                  <span className="success-icon">✅</span>
                  <span>{success}</span>
                  <div className="success-progress">
                    <div className="progress-bar"></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                  <label htmlFor="title">
                    Title <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon"> </span>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter an eye-catching title"
                      disabled={loading}
                      maxLength="200"
                    />
                  </div>
                  <div className="char-counter">
                    <span className={title.length > 180 ? 'warning' : ''}>{title.length}</span>
                    <span>/200 characters</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="content">
                    Content <span className="required">*</span>
                  </label>
                  <div className="input-wrapper textarea-wrapper">
                    <span className="input-icon"> </span>
                    <textarea
                      id="content"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your post here..."
                      rows="12"
                      disabled={loading}
                    />
                  </div>
                  <div className="char-counter">
                    <span>{body.length}</span>
                    <span> characters</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image">
                    Cover Image <span className="optional">(Optional)</span>
                  </label>
                  <div className="image-upload-container">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      disabled={loading}
                    />
                    <div className="upload-area">
                      <span className="upload-icon">📷</span>
                      <p>Click or drag image to upload</p>
                      <small>Max 5MB (JPG, PNG, GIF)</small>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" className="preview-image" />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview('');
                        }}
                        className="remove-image-btn"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn-cancel"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Publish Post
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="writing-tips">
                <h4 className="tips-title">💡 Writing Tips:</h4>
                <ul className="tips-list">
                  <li>Use a clear and descriptive title</li>
                  <li>Break long paragraphs for better readability</li>
                  <li>Add examples or personal experiences</li>
                  <li>Proofread before publishing</li>
                </ul>
              </div>
            </div>

            {/* Sidebar Tips */}
            <div className="create-post-sidebar">
              <div className="sidebar-card">
                <div className="sidebar-icon">🌱</div>
                <h3>Why Share Your Story?</h3>
                <p>Your experiences can inspire others to take action and protect our planet.</p>
              </div>
              
              <div className="sidebar-card">
                <div className="sidebar-icon">🏆</div>
                <h3>Get Featured</h3>
                <p>Exceptional posts get featured on our homepage and social media channels.</p>
              </div>
              
              <div className="sidebar-card">
                <div className="sidebar-icon">👥</div>
                <h3>Build Community</h3>
                <p>Connect with like-minded environmental advocates worldwide.</p>
              </div>

              <div className="sidebar-card">
                <div className="sidebar-icon">📊</div>
                <h3>Post Stats</h3>
                <p>Track how many people read and engage with your posts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatePostPage;


