import express from 'express';
import jwt from 'jsonwebtoken';
import Doubt from '../models/Doubt.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Create a new doubt
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Handle tags field properly - it could be string or array
    let tagsArray = [];
    if (tags) {
      if (typeof tags === 'string') {
        tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(tags)) {
        tagsArray = tags.filter(tag => tag && tag.trim());
      }
    }

    const doubt = new Doubt({
      user: req.user.userId,
      title,
      content,
      category,
      tags: tagsArray
    });

    await doubt.save();

    // Increment user's doubts asked count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { doubtsAsked: 1 }
    });

    // Populate user info
    await doubt.populate('user', 'username profilePhoto');

    res.status(201).json({
      message: 'Doubt created successfully',
      doubt
    });

  } catch (error) {
    console.error('Create doubt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all doubts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const doubts = await Doubt.find(query)
      .populate('user', 'username profilePhoto')
      .populate('solutions.user', 'username profilePhoto')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Doubt.countDocuments(query);

    res.json({
      doubts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });

  } catch (error) {
    console.error('Get doubts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific doubt by ID
router.get('/:id', async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('user', 'username profilePhoto')
      .populate('solutions.user', 'username profilePhoto');

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Increment views
    await doubt.incrementViews();

    res.json(doubt);

  } catch (error) {
    console.error('Get doubt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a solution to a doubt
router.post('/:id/solutions', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    await doubt.addSolution(req.user.userId, content);

    // Populate the new solution
    await doubt.populate('solutions.user', 'username profilePhoto');

    res.json({
      message: 'Solution added successfully',
      doubt
    });

  } catch (error) {
    console.error('Add solution error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept a solution
router.put('/:id/solutions/:solutionId/accept', authenticateToken, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Check if the user is the doubt creator
    if (doubt.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the doubt creator can accept solutions' });
    }

    await doubt.acceptSolution(req.params.solutionId);

    // Increment the solver's doubts solved count
    const solution = doubt.solutions.id(req.params.solutionId);
    if (solution) {
      await User.findByIdAndUpdate(solution.user, {
        $inc: { doubtsSolved: 1 }
      });
    }

    res.json({
      message: 'Solution accepted successfully',
      doubt
    });

  } catch (error) {
    console.error('Accept solution error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get trending doubts (most viewed)
router.get('/trending/views', async (req, res) => {
  try {
    const trendingDoubts = await Doubt.find()
      .populate('user', 'username profilePhoto')
      .sort({ views: -1 })
      .limit(5);

    res.json(trendingDoubts);

  } catch (error) {
    console.error('Get trending doubts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's doubts
router.get('/user/:userId', async (req, res) => {
  try {
    const doubts = await Doubt.find({ user: req.params.userId })
      .populate('user', 'username profilePhoto')
      .sort({ createdAt: -1 });

    res.json(doubts);

  } catch (error) {
    console.error('Get user doubts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 