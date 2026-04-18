//backend/server.js
require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');

// Import routes (you will create these files in the next steps)
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
connectDB(); // Connect to MongoDB

//──Middleware─────────────────────────────────────────────────
// Allow React (ports 3000 and 3001) to call this server
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://finalfolioproject-monicaamer1.vercel.app',
    'https://final-folio-project-monica-amer1-wd.vercel.app'  // ← IDAGDAG ITO!
  ], 
  credentials: true 
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse incoming form-urlencoded request bodies (for simple forms)
app.use(express.urlencoded({ extended: true }));

// Serve uploaded image files as public URLs
// e.g. http://localhost:5000/uploads/my-image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//──Health Check for Render (ADDED - do not remove)───────────
// This tells Render that your server is alive and ready
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Optional: Root route to test if backend is accessible
app.get('/', (req, res) => {
  res.status(200).json({ message: 'TheFolio API is running' });
});

//──Routes────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Multer error handling middleware - comes after routes
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.name === 'MulterError') {
    console.error('[MULTER ERROR]', err);
    if (err.code === 'FILE_TOO_LARGE' || err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max 5MB allowed.' });
    }
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  }
  next(err);
});

// General error handling middleware - MUST be last
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message, error: message });
});

//──Start Server──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});