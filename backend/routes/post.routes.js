//backend/routes/post.routes.js
const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// GET /api/posts — Public: all published posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { 
    console.error('[GET POSTS ERROR]', err);
    res.status(500).json({ message: err.message }); 
  }
});

// GET /api/posts/user/:userId — Get posts by specific user (for profile page)
router.get('/user/:userId', protect, async (req, res) => {
  try {
    console.log('[GET USER POSTS]', req.params.userId, 'requested by', req.user._id);
    const posts = await Post.find({ 
      author: req.params.userId,
      status: 'published' 
    })
      .populate('author', 'name profilePic')
      .populate('likes', 'name profilePic')
      .sort({ createdAt: -1 });
    console.log('[GET USER POSTS] Found', posts.length, 'posts');
    console.log('[GET USER POSTS] Posts data:', posts.map(p => ({ id: p._id, title: p.title, author: p.author })));
    res.json(posts);
  } catch (err) { 
    console.error('[GET USER POSTS ERROR]', err);
    res.status(500).json({ message: err.message }); 
  }
});

// GET /api/posts/:id — Get single post by ID (public for published posts)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id,
      status: 'published' 
    })
      .populate('author', 'name profilePic')
      .populate('likes', 'name profilePic');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) { 
    console.error('[GET SINGLE POST ERROR]', err);
    res.status(500).json({ message: err.message }); 
  }
});

// POST /api/posts — Member or Admin: create new post
// upload.single('image') handles optional image file
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('[POST CREATE] req.body:', req.body);
    console.log('[POST CREATE] req.file:', req.file);
    console.log('[POST CREATE] req.user:', req.user._id, req.user.role);
    
    const { title, body } = req.body || {};
    
    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required', received: { title } });
    }
    if (!body || !body.trim()) {
      return res.status(400).json({ message: 'Post content is required', received: { body } });
    }
    
    const image = req.file ? req.file.filename : '';
    
    const post = await Post.create({ 
      title: title.trim(), 
      body: body.trim(), 
      image, 
      author: req.user._id 
    });
    
    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) { 
    console.error('[CREATE POST ERROR]', err);
    res.status(500).json({ message: err.message, error: err.toString() }); 
  }
});

// PUT /api/posts/:id — Edit: only post owner OR admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) 
      return res.status(403).json({ message: 'Not authorized' });
    
    if (req.body.title) post.title = req.body.title;
    if (req.body.body) post.body = req.body.body;
    if (req.file) post.image = req.file.filename;
    
    await post.save();
    res.json(post);
  } catch (err) { 
    console.error('[UPDATE POST ERROR]', err);
    res.status(500).json({ message: err.message }); 
  }
});

// POST /api/posts/:id/like — Like or unlike a post
router.post('/:id/like', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name profilePic').populate('likes', 'name profilePic');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const userId = req.user._id.toString();
    const userIdInLikes = post.likes.some(like => like._id.toString() === userId);
    
    if (userIdInLikes) {
      // Unlike: remove user from likes array
      post.likes = post.likes.filter(like => like._id.toString() !== userId);
    } else {
      // Like: add user to likes array
      post.likes.push(req.user._id);
    }
    
    await post.save();
    res.json({ post });
  } catch (err) { 
    console.error('[LIKE POST ERROR]', err);
    res.status(500).json({ message: err.message }); 
  }
});

// DELETE /api/posts/:id — Delete: only post owner OR admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) 
      return res.status(403).json({ message: 'Not authorized' });
    
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) { 
    console.error('[DELETE POST ERROR]', err);
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;