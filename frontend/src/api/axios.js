// frontend/src/api/axios.js
import axios from 'axios';

// ✅ ADDED: Use environment variable if available, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API_URL,  // ← CHANGED: from hardcoded to dynamic
});

// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't set Content-Type for FormData - let the browser handle it
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export default instance;