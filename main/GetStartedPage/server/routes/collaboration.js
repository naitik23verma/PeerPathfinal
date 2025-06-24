import express from 'express';
import jwt from 'jsonwebtoken';
import Collaboration from '../models/Collaboration.js';

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

// Create a new collaboration project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, skills, maxMembers } = req.body;

    // Handle skills field properly - it could be string or array
    let skillsArray = [];
    if (skills) {
      if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      } else if (Array.isArray(skills)) {
        skillsArray = skills.filter(skill => skill && skill.trim());
      }
    }

    const collaboration = new Collaboration({
      title,
      description,
      creator: req.user.userId,
      category,
      skills: skillsArray,
      maxMembers: maxMembers || 10
    });

    // Add creator as first member
    collaboration.members.push({
      user: req.user.userId,
      role: 'creator'
    });

    await collaboration.save();

    // Populate user info
    await collaboration.populate('creator', 'username profilePhoto');
    await collaboration.populate('members.user', 'username profilePhoto');

    res.status(201).json({
      message: 'Collaboration project created successfully',
      collaboration
    });

  } catch (error) {
    console.error('Create collaboration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all collaboration projects
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
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const collaborations = await Collaboration.find(query)
      .populate('creator', 'username profilePhoto')
      .populate('members.user', 'username profilePhoto')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Collaboration.countDocuments(query);

    res.json({
      collaborations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });

  } catch (error) {
    console.error('Get collaborations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific collaboration project
router.get('/:id', async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('creator', 'username profilePhoto')
      .populate('members.user', 'username profilePhoto');

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration project not found' });
    }

    res.json(collaboration);

  } catch (error) {
    console.error('Get collaboration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join a collaboration project
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration project not found' });
    }

    await collaboration.addMember(req.user.userId);

    // Populate user info
    await collaboration.populate('creator', 'username profilePhoto');
    await collaboration.populate('members.user', 'username profilePhoto');

    res.json({
      message: 'Successfully joined the project',
      collaboration
    });

  } catch (error) {
    console.error('Join collaboration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Leave a collaboration project
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration project not found' });
    }

    // Check if user is the creator
    if (collaboration.creator.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Creator cannot leave the project. Transfer ownership or delete the project.' });
    }

    await collaboration.removeMember(req.user.userId);

    // Populate user info
    await collaboration.populate('creator', 'username profilePhoto');
    await collaboration.populate('members.user', 'username profilePhoto');

    res.json({
      message: 'Successfully left the project',
      collaboration
    });

  } catch (error) {
    console.error('Leave collaboration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update collaboration project status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration project not found' });
    }

    // Check if user is the creator
    if (collaboration.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the creator can update project status' });
    }

    collaboration.status = status;
    await collaboration.save();

    // Populate user info
    await collaboration.populate('creator', 'username profilePhoto');
    await collaboration.populate('members.user', 'username profilePhoto');

    res.json({
      message: 'Project status updated successfully',
      collaboration
    });

  } catch (error) {
    console.error('Update collaboration status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's collaborations
router.get('/user/:userId', async (req, res) => {
  try {
    const collaborations = await Collaboration.find({
      $or: [
        { creator: req.params.userId },
        { 'members.user': req.params.userId }
      ]
    })
      .populate('creator', 'username profilePhoto')
      .populate('members.user', 'username profilePhoto')
      .sort({ createdAt: -1 });

    res.json(collaborations);

  } catch (error) {
    console.error('Get user collaborations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 