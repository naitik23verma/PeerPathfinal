import express from 'express';
import Group from '../models/Group.js';
import { authenticateToken } from './users.js'; // adjust import if needed

const router = express.Router();

// Create or get a group by roomId
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { groupName, members, roomId } = req.body;
    if (!groupName || !members || members.length < 2 || !roomId) {
      return res.status(400).json({ message: 'Group name, roomId, and at least 2 members required.' });
    }
    // Check if group already exists
    let group = await Group.findOne({ roomId }).populate('members', 'username name');
    if (group) {
      return res.status(200).json(group);
    }
    // Create new group
    group = new Group({ groupName, members, roomId });
    await group.save();
    group = await Group.findById(group._id).populate('members', 'username name');
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all groups with member info
router.get('/', authenticateToken, async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'username name');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 