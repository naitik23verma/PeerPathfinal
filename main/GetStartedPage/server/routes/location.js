import express from 'express';
import jwt from 'jsonwebtoken';
import Location from '../models/Location.js';


// GET /api/location/nearby?lat=23.25&lng=77.41
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

// Create a new location/ride share
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      currentLocation,
      destination,
      departureTime,
      notice,
      contactInfo,
      maxPassengers
    } = req.body;

    // Validate required fields
    if (!currentLocation || !currentLocation.coordinates) {
      return res.status(400).json({ message: 'Current location coordinates are required' });
    }

    if (!destination || !destination.coordinates) {
      return res.status(400).json({ message: 'Destination coordinates are required' });
    }

    // Validate and parse departure time
    let parsedDepartureTime;
    if (departureTime) {
      parsedDepartureTime = new Date(departureTime);
      if (isNaN(parsedDepartureTime.getTime())) {
        return res.status(400).json({ message: 'Invalid departure time format' });
      }
    } else {
      parsedDepartureTime = new Date(); // Default to current time
    }

    const location = new Location({
      user: req.user.userId,
      currentLocation: {
        type: 'Point',
        coordinates: currentLocation.coordinates,
        address: currentLocation.address || ''
      },
      destination: {
        type: 'Point',
        coordinates: destination.coordinates,
        address: destination.address || ''
      },
      departureTime: parsedDepartureTime,
      notice: notice || '',
      contactInfo: contactInfo || {},
      maxPassengers: maxPassengers || 3
    });

    await location.save();

    // Populate user info
    await location.populate('user', 'username profilePhoto');
    await location.populate('passengers.user', 'username profilePhoto');

    res.status(201).json({
      message: 'Ride share created successfully',
      location
    });

  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all active ride shares
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchLocation = req.query.location;

    let query = { isActive: true };

    // If location search is provided, find nearby rides
    if (searchLocation && searchLocation.coordinates) {
      query.currentLocation = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: searchLocation.coordinates
          },
          $maxDistance: 50000 // 50km radius
        }
      };
    }

    const locations = await Location.find(query)
      .populate('user', 'username profilePhoto')
      .populate('passengers.user', 'username profilePhoto')
      .sort({ departureTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Location.countDocuments(query);

    res.json({
      locations,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });

  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific location/ride share
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id)
      .populate('user', 'username profilePhoto')
      .populate('passengers.user', 'username profilePhoto');

    if (!location) {
      return res.status(404).json({ message: 'Ride share not found' });
    }

    res.json(location);

  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join a ride share
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Ride share not found' });
    }

    if (!location.isActive) {
      return res.status(400).json({ message: 'This ride share is no longer active' });
    }

    try {
      await location.addPassenger(req.user.userId);
    } catch (err) {
      // Return a 400 error for known issues (like already a passenger or ride full)
      return res.status(400).json({ message: err.message });
    }

    // Populate user info
    await location.populate('user', 'username profilePhoto');
    await location.populate('passengers.user', 'username profilePhoto');

    res.json({
      message: 'Successfully joined the ride share',
      location
    });

  } catch (error) {
    console.error('Join location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Leave a ride share
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Ride share not found' });
    }

    // Check if user is the driver
    if (location.user.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Driver cannot leave the ride share. Cancel the ride instead.' });
    }

    await location.removePassenger(req.user.userId);

    // Populate user info
    await location.populate('user', 'username profilePhoto');
    await location.populate('passengers.user', 'username profilePhoto');

    res.json({
      message: 'Successfully left the ride share',
      location
    });

  } catch (error) {
    console.error('Leave location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Find nearby ride shares
router.get('/nearby/search', async (req, res) => {
  try {
    const { coordinates, maxDistance = 50000 } = req.query; // maxDistance in meters

    if (!coordinates) {
      return res.status(400).json({ message: 'Coordinates are required' });
    }

    const [lng, lat] = coordinates.split(',').map(Number);

    const nearbyLocations = await Location.find({
      isActive: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
      .populate('user', 'username profilePhoto')
      .populate('passengers.user', 'username profilePhoto')
      .sort({ departureTime: 1 })
      .limit(20);

    res.json(nearbyLocations);

  } catch (error) {
    console.error('Search nearby error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's ride shares
router.get('/user/:userId', async (req, res) => {
  try {
    const locations = await Location.find({
      $or: [
        { user: req.params.userId },
        { 'passengers.user': req.params.userId }
      ]
    })
      .populate('user', 'username profilePhoto')
      .populate('passengers.user', 'username profilePhoto')
      .sort({ departureTime: -1 });

    res.json(locations);

  } catch (error) {
    console.error('Get user locations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }

  try {
    const locations = await Location.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius) * 1000 // meters
        }
      },
      isActive: true
    })
    .populate('user', 'username profilePhoto email');

    res.json({ nearby: locations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch nearby peers' });
  }
});





// Cancel a ride share (driver only)
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Ride share not found' });
    }

    // Check if user is the driver
    if (location.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the driver can cancel the ride share' });
    }

    location.isActive = false;
    await location.save();

    // Populate user info
    await location.populate('user', 'username profilePhoto');
    await location.populate('passengers.user', 'username profilePhoto');

    res.json({
      message: 'Ride share cancelled successfully',
      location
    });

  } catch (error) {
    console.error('Cancel location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






export default router; 