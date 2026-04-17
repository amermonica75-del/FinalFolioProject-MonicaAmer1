// frontend/src/components/AdminRoute.js

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Combined loading UI (kept both styles)
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Checking permissions...</p>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Logged in but NOT admin → go home
  if (user.role !== 'admin') {
    return <Navigate to="/home" />;
  }

  return children;
};

export default AdminRoute;
