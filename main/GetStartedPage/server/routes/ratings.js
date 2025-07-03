import express from 'express';
import Rating from '../models/Rating.js';

const router = express.Router();

// POST /api/ratings - submit a rating (one per email)
router.post('/', async (req, res) => {
  const { value, email } = req.body;
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ error: 'Invalid rating value' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    // Only one rating per email (update if exists)
    let rating = await Rating.findOne({ email });
    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = new Rating({ value, email });
      await rating.save();
    }
    res.json({ success: true, rating });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save rating', details: error.message });
  }
});

// GET /api/ratings - get average and count
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find();
    const count = ratings.length;
    const average = count ? (ratings.reduce((a, b) => a + b.value, 0) / count).toFixed(2) : '0.00';
    res.json({ average, count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings', details: error.message });
  }
});

export default router; 