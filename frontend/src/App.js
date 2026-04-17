// frontend/src/App.js
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import EntertainmentPage from './pages/EntertainmentPage';

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        {/* Public routes — anyone can visit */}
        <Route path='/' element={<SplashPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/entertainment' element={<EntertainmentPage />} />
        <Route path='/posts/:id' element={<PostPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        
        {/* Protected routes — must be logged in */}
        <Route path='/profile' 
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/create-post' 
          element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path='/edit-post/:id' 
          element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        
        {/* Admin only — redirects members/guests to home */}
        <Route path='/admin' 
          element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
