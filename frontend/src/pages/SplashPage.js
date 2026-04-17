import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './SplashPage.css';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <div className="splash-card">
        <div className="splash-header">
          <span className="splash-emoji">🌿</span>
          <h1>EcoGuardians</h1>
        </div>
        <p className="splash-subtitle">Loading your eco quiz journey...</p>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Connecting with nature, one green step at a time.</p>
        </div>
      </div>
    </div>
  );
}


