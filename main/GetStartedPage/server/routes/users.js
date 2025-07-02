import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Multer config for profile photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, 'profilePhoto-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('username profilePhoto bio expertise skills')
      .sort({ username: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get top helpers (users who solved most doubts)
router.get('/top-helpers', async (req, res) => {
  try {
    const topHelpers = await User.find()
      .sort({ doubtsSolved: -1 })
      .limit(10)
      .select('username profilePhoto doubtsSolved expertise bio skills year');

    console.log('Top helpers found:', topHelpers.length);
    res.json(topHelpers);
  } catch (error) {
    console.error('Get top helpers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get top doubt solvers (users who solved most doubts)
router.get('/top-solvers', async (req, res) => {
  try {
    const topSolvers = await User.find()
      .sort({ doubtsSolved: -1 })
      .limit(6)
      .select('username profilePhoto doubtsSolved expertise bio skills year');

    console.log('Top solvers found:', topSolvers.length);
    res.json(topSolvers);
  } catch (error) {
    console.error('Get top solvers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user statistics
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('doubtsSolved doubtsAsked weeklyStats joinDate');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all chat messages for a room
router.get('/chat/:roomId', authenticateToken, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ roomId: req.params.roomId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username profilePhoto');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
});

// Post a new chat message
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { roomId, content, receiver, time } = req.body;
    const message = new ChatMessage({
      roomId,
      sender: req.user.userId,
      receiver,
      content,
      time
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// Upload profile photo endpoint
router.post('/upload-profile-photo', authenticateToken, upload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('Profile photo upload request received');
    console.log('User ID from token:', req.user.userId);
    console.log('File received:', req.file);
    
    if (!req.file) {
      console.log('No file uploaded error');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('Updating profile photo to:', `/uploads/${req.file.filename}`);
    
    // Use findByIdAndUpdate to update only the profilePhoto field
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePhoto: `/uploads/${req.file.filename}` },
      { new: true, runValidators: false }
    );
    
    if (!updatedUser) {
      console.log('User not found error');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Profile photo updated successfully');
    res.json({ profilePhoto: updatedUser.profilePhoto });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get most active users (by visit count)
router.get('/most-active', async (req, res) => {
  try {
    const users = await User.find()
      .select('username profilePhoto visitCount expertise bio skills year')
      .lean();
    // Add visitCount to each user (default 0 if missing)
    const usersWithVisitCount = users.map(user => ({
      ...user,
      visitCount: user.visitCount || 0
    }));
    // Sort by visitCount descending
    usersWithVisitCount.sort((a, b) => b.visitCount - a.visitCount);
    // Limit to top 6
    const topActive = usersWithVisitCount.slice(0, 6);
    res.json(topActive);
  } catch (error) {
    console.error('Get most active users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add after other routes
router.post('/visit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('User ID from token:', userId);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.visitCount = (user.visitCount || 0) + 1;
    await user.save();
    console.log('Visit count updated for user:', user.username, 'New count:', user.visitCount);
    res.json({ visitCount: user.visitCount, activeDays: user.weeklyStats ? user.weeklyStats.length : 0 });
  } catch (err) {
    console.error('Visit count update error:', err);
    res.status(500).json({ error: 'Failed to update visit count' });
  }
});

export default router;
export { authenticateToken }; 