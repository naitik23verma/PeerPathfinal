import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/geocode?q=searchterm
router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter q' });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'PeerPathApp/1.0 (your@email.com)',
        'Accept-Language': 'en',
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Nominatim', details: error.message });
  }
});

export default router; 