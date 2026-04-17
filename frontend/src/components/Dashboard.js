// frontend/src/pages/Dashboard.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    memberSince: ''
  });

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const postsRes = await API.get('/posts/user');
      setUserPosts(postsRes.data);
      
      const totalLikes = postsRes.data.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
      
      setStats({
        totalPosts: postsRes.data.length,
        totalLikes: totalLikes,
        memberSince: user.createdAt || new Date().toISOString()
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate, loadDashboardData]);

  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Welcome back, {user?.name}! 🌱</h1>
            <p>Your environmental impact dashboard</p>
          </div>
          <div className="header-right">
            <span className="user-email">{user?.email}</span>
            <button 
              onClick={refreshDashboard} 
              className={`refresh-btn ${isRefreshing ? 'loading' : ''}`}
              title="Refresh dashboard data"
              disabled={isRefreshing}
            >
              {isRefreshing ? '⟳' : '🔄'} {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{stats.totalPosts}</h3>
              <p>Your Posts</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-info">
              <h3>{stats.totalLikes}</h3>
              <p>Total Likes Received</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{new Date(stats.memberSince).toLocaleDateString()}</h3>
              <p>Member Since</p>
            </div>
          </div>
        </div>

        {/* User's Posts Section */}
        <div className="user-posts-section">
          <div className="section-header">
            <h2>Your Environmental Posts</h2>
            <button 
              onClick={() => navigate('/create-post')}
              className="create-post-btn"
            >
              + Create New Post
            </button>
          </div>
          
          {userPosts.length === 0 ? (
            <div className="empty-posts">
              <p>You haven't created any posts yet.</p>
              <button onClick={() => navigate('/create-post')} className="btn-primary">
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="posts-grid">
              {userPosts.map(post => (
                <div key={post._id} className="post-card">
                  {post.image && (
                    <img 
                      src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`} 
                      alt={post.title}
                      className="post-image"
                    />
                  )}
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.body?.substring(0, 150)}...</p>
                    <div className="post-meta">
                      <span>❤️ {post.likes?.length || 0} likes</span>
                      <span>💬 {post.comments?.length || 0} comments</span>
                      <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="post-actions">
                      <button 
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="view-btn"
                      >
                        View Post
                      </button>
                      <button 
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
