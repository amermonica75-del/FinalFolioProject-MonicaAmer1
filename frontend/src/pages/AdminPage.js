// frontend/src/pages/AdminPage.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './AdminPage.css';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalAdmins: 0,
    totalRegularUsers: 0
  });

  // Function to load all data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data);
      
      const postsRes = await API.get('/admin/posts');
      setPosts(postsRes.data);
      
      const adminCount = usersRes.data.filter(u => u.role === 'admin').length;
      setStats({
        totalUsers: usersRes.data.length,
        totalPosts: postsRes.data.length,
        totalAdmins: adminCount,
        totalRegularUsers: usersRes.data.length - adminCount
      });
    } catch (err) {
      console.error(err);
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/home');
      return;
    }
    
    // Load data only once when component mounts
    loadData();
  }, [user, navigate, loadData]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await API.put(`/admin/users/${userId}/status`);
        // Update local state immediately
        setUsers(prevUsers => prevUsers.map(u => 
          u._id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        ));
        showNotification('User status updated successfully', 'success');
      } catch (err) {
        showNotification('Failed to update user status', 'error');
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to remove this post?')) {
      try {
        await API.put(`/admin/posts/${postId}/remove`);
        // Update local state immediately
        setPosts(prevPosts => prevPosts.map(p => 
          p._id === postId ? { ...p, status: 'removed' } : p
        ));
        showNotification('Post removed successfully', 'success');
      } catch (err) {
        showNotification('Failed to remove post', 'error');
      }
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const viewUserDetails = (user) => {
    setSelectedItem(user);
    setShowUserModal(true);
  };

  const viewPostDetails = (post) => {
    setSelectedItem(post);
    setShowPostModal(true);
  };

  const closeModal = () => {
    setShowUserModal(false);
    setShowPostModal(false);
    setSelectedItem(null);
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <span className="logo-icon">👑</span>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-info">
            <span className="admin-name">Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Always visible */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{stats.totalPosts}</h3>
            <p>Total Posts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-info">
            <h3>{stats.totalAdmins}</h3>
            <p>Administrators</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-info">
            <h3>{stats.totalRegularUsers}</h3>
            <p>EcoGuardians</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('users');
            setSearchTerm('');
          }}
        >
          👥 Manage Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('posts');
            setSearchTerm('');
          }}
        >
          📝 Manage Posts
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={`Search ${activeTab === 'users' ? 'users by name or email' : 'posts by title or content'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="data-table-container">
          <div className="table-header">
            <h3>All Members</h3>
            <span className="table-count">{filteredUsers.length} users found</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(userItem => (
                <tr key={userItem._id}>
                  <td>
                    <img 
                      src={userItem.profilePic ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${userItem.profilePic}` : `https://ui-avatars.com/api/?background=3CB371&color=fff&size=40&name=${userItem.name}`}
                      alt={userItem.name}
                      className="avatar-small"
                    />
                  </td>
                  <td><strong>{userItem.name}</strong></td>
                  <td>{userItem.email}</td>
                  <td>
                    <span className={`role-badge ${userItem.role === 'admin' ? 'admin' : 'user'}`}>
                      {userItem.role === 'admin' ? '👑 Admin' : '🌱 User'}
                    </span>
                  </td>
                  <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      onClick={() => viewUserDetails(userItem)}
                      className="action-btn view"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(userItem._id)}
                      className="action-btn delete"
                      title="Deactivate User"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">👥</span>
              <p>No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Posts Table */}
      {activeTab === 'posts' && (
        <div className="data-table-container">
          <div className="table-header">
            <h3>All Posts</h3>
            <span className="table-count">{filteredPosts.length} posts found</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Content Preview</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post._id}>
                  <td>
                    {post.image ? (
                      <img 
                        src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`}
                        alt={post.title}
                        className="post-thumb"
                      />
                    ) : (
                      <div className="post-thumb-placeholder">📷</div>
                    )}
                  </td>
                  <td><strong>{post.title}</strong></td>
                  <td>{post.author?.name || 'Unknown'}</td>
                  <td className="post-preview">{post.body?.substring(0, 100)}...</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      onClick={() => viewPostDetails(post)}
                      className="action-btn view"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post._id)}
                      className="action-btn delete"
                      title="Delete Post"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPosts.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>No posts found</p>
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-detail-avatar">
                <img 
                  src={selectedItem.profilePic ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${selectedItem.profilePic}` : `https://ui-avatars.com/api/?background=3CB371&color=fff&size=100&name=${selectedItem.name}`}
                  alt={selectedItem.name}
                />
              </div>
              <div className="detail-item">
                <label>Name:</label>
                <p>{selectedItem.name}</p>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <p>{selectedItem.email}</p>
              </div>
              <div className="detail-item">
                <label>Role:</label>
                <p className={`role-badge ${selectedItem.role === 'admin' ? 'admin' : 'user'}`}>
                  {selectedItem.role === 'admin' ? '👑 Administrator' : '🌱 Regular User'}
                </p>
              </div>
              <div className="detail-item">
                <label>Bio:</label>
                <p>{selectedItem.bio || 'No bio provided'}</p>
              </div>
              <div className="detail-item">
                <label>Joined:</label>
                <p>{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Details Modal */}
      {showPostModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post Details</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {selectedItem.image && (
                <div className="post-detail-image">
                  <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${selectedItem.image}`} alt={selectedItem.title} />
                </div>
              )}
              <div className="detail-item">
                <label>Title:</label>
                <p><strong>{selectedItem.title}</strong></p>
              </div>
              <div className="detail-item">
                <label>Author:</label>
                <p>{selectedItem.author?.name || 'Unknown'}</p>
              </div>
              <div className="detail-item">
                <label>Content:</label>
                <p className="post-full-content">{selectedItem.body}</p>
              </div>
              <div className="detail-item">
                <label>Created:</label>
                <p>{new Date(selectedItem.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;


