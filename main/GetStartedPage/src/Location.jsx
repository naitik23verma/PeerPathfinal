import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import NavigationBar from './components/NavigationBar.jsx';
import './Location.css';
import axios from 'axios';
import DotGrid from "./components/DotGrid.jsx";
import AdvancedFooter from './components/AdvancedFooter.jsx';
import TypewriterText from './components/TypewriterText.jsx';

const API_URL = 'https://peerpathfinal.onrender.com/api';
const GOOGLE_MAPS_API_KEY = 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg';

// Google Maps Mini Map Component for Ride Cards
const RideCardMap = ({ fromAddress, toAddress, rideId }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !fromAddress || !toAddress || mapInstance) return;

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 10,
          center: { lat: 20.5937, lng: 78.9629 }, // Default to India
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#000000' }]
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.fill',
              stylers: [{ color: '#000000' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#2c2c2c' }]
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{ color: '#2c2c2c' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }]
            }
          ]
        });

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#8b5cf6',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        });

        setMapInstance(map);

        // Calculate and display route
        calculateRoute(directionsService, directionsRenderer, fromAddress, toAddress);

      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    const calculateRoute = (service, renderer, origin, destination) => {
      const request = {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      };

      service.route(request, (result, status) => {
        if (status === 'OK') {
          renderer.setDirections(result);
          
          // Fit map to show the entire route
          const bounds = new window.google.maps.LatLngBounds();
          result.routes[0].legs.forEach(leg => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          mapInstance.fitBounds(bounds);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    };

    loadGoogleMaps();

    return () => {
      if (mapInstance) {
        // Cleanup will be handled by Google Maps
      }
    };
  }, [fromAddress, toAddress]);

  return (
    <div ref={mapRef} className="ride-card-map" style={{ height: '150px', width: '100%', borderRadius: '8px' }}></div>
  );
};

// Simple Map Component
const SimpleMap = ({ fromAddress, toAddress }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!fromAddress || !toAddress) return;

    const loadMap = () => {
      if (window.google && window.google.maps) {
        createMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.onload = createMap;
        document.head.appendChild(script);
      }
    };

    const createMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: 20.5937, lng: 78.9629 },
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#8b5cf6',
          strokeWeight: 4
        }
      });

      const request = {
        origin: fromAddress,
        destination: toAddress,
        travelMode: window.google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      });
    };

    loadMap();
  }, [fromAddress, toAddress]);

  return (
    <div ref={mapRef} style={{ height: '150px', width: '100%', borderRadius: '8px' }} />
  );
};

// Address Input Component with Autocomplete
const AddressInput = ({ value, onChange, placeholder, onAddressSelect, name, className = '' }) => {
  const inputRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'IN' }, // Restrict to India
      fields: ['formatted_address', 'geometry', 'name', 'place_id']
    });

    setAutocomplete(autocompleteInstance);

    // Handle place selection
    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (place.geometry) {
        const address = place.formatted_address || place.name;
        setInputValue(address);
        onChange({ target: { name: name, value: address } });
        onAddressSelect({
          address: address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id
        });
        setShowSuggestions(false);
      }
    });
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ target: { name: name, value: newValue } });

    // Get suggestions if input is long enough
    if (newValue.length >= 3) {
      getSuggestions(newValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getSuggestions = async (query) => {
    try {
      if (!window.google || !window.google.maps) return;

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: query,
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'IN' }
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } catch (error) {
      console.error('Error getting place predictions:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const address = suggestion.description;
    setInputValue(address);
    onChange({ target: { name: name, value: address } });
    onAddressSelect({
      address: address,
      placeId: suggestion.place_id
    });
    setShowSuggestions(false);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 3) {
      getSuggestions(inputValue);
    }
  };

  return (
    <div className="address-input-container">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={`address-input ${className}`}
        onBlur={handleInputBlur}
        autoComplete="off"
        name={name}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="address-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-text">{suggestion.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Location({ currentUser, onLogout }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    from: '',
    to: '',
    time: '',
    seats: 1,
    note: ''
  });

  // Fix: Track coordinates for both fields independently
  const [formCoords, setFormCoords] = useState({ from: null, to: null });

  // Sample data for testing layout
  const sampleRides = [
    {
      _id: '1',
      user: { username: 'John Doe', profilePhoto: null },
      currentLocation: { address: 'Delhi, India' },
      destination: { address: 'Mumbai, India' },
      departureTime: new Date(Date.now() + 86400000).toISOString(),
      maxPassengers: 4,
      currentPassengers: 2,
      distance: 1400,
      travelTime: 120,
      weather: 'Sunny, 25°C',
      notice: 'Looking for travel companions!'
    },
    {
      _id: '2',
      user: { username: 'Jane Smith', profilePhoto: null },
      currentLocation: { address: 'Bangalore, India' },
      destination: { address: 'Chennai, India' },
      departureTime: new Date(Date.now() + 172800000).toISOString(),
      maxPassengers: 3,
      currentPassengers: 1,
      distance: 350,
      travelTime: 45,
      weather: 'Cloudy, 22°C',
      notice: 'Early morning ride'
    }
  ];

  const fetchRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Fetched rides data:', res.data);
      setRides(res.data.locations || []);
    } catch (e) {
      setError('Failed to load rides.');
      console.error('Error fetching rides:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleJoinRide = async (rideId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/${rideId}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchRides();
    } catch (err) {
      setError('Failed to join ride.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRide = async (rideId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/${rideId}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchRides();
    } catch (err) {
      setError('Failed to leave ride.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel ride for creator
  const handleCancelRide = async (rideId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${rideId}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchRides();
    } catch (err) {
      setError('Failed to cancel ride.');
    } finally {
      setLoading(false);
    }
  };

  // Fix: Add form submission handler
  const handleCreateRide = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.from || !form.to || !form.time || !form.seats || !formCoords.from || !formCoords.to) {
      setError('Please fill all required fields and select valid locations.');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        API_URL,
        {
          currentLocation: {
            coordinates: [formCoords.from.lng, formCoords.from.lat],
            address: form.from
          },
          destination: {
            coordinates: [formCoords.to.lng, formCoords.to.lat],
            address: form.to
          },
          departureTime: form.time,
          notice: form.note,
          maxPassengers: form.seats
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreate(false);
      setForm({ from: '', to: '', time: '', seats: 1, note: '' });
      setFormCoords({ from: null, to: null });
      fetchRides();
    } catch (err) {
      setError('Failed to create ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (field, address) => {
    setForm(prev => ({
      ...prev,
      [field]: address.address
    }));
  };

  const createFormRef = useRef(null);

  const handleOfferRideClick = () => {
    setShowCreate((prev) => {
      const willOpen = !prev;
      if (!prev) {
        // If opening, scroll after a short delay to allow render
        setTimeout(() => {
          if (createFormRef.current) {
            createFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }
      return willOpen;
    });
  };

  return (
    <div className="location-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Animated DotGrid background */}
      <DotGrid 
        className="location-dotgrid-bg"
        dotSize={5}
        gap={32}
        baseColor="#1e293b"
        activeColor="#6366f1"
        proximity={150}
        speedTrigger={100}
        shockRadius={250}
        shockStrength={5}
        maxSpeed={5000}
        resistance={750}
        returnDuration={1.5}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
      />
      <NavigationBar 
        currentUser={currentUser}
        onLogout={onLogout}
        showUserInfo={true}
        showNotifications={true}
        showSearch={false}
      />

      <div className="location-container">
        <div className="location-upper-row">
          <motion.div 
            className="location-header-left"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Find Your Ride</h1>
            <p>Connect with peers for shared rides and save on travel costs</p>
            <div className="location-actions">
              <button className="create-btn" onClick={handleOfferRideClick}>
                {showCreate ? 'Cancel' : 'Offer a Ride'}
              </button>
            </div>
          </motion.div>
          <motion.div 
            className="location-header-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img src="/WorldMap.png" alt="World Map" className="location-worldmap-img" />
          </motion.div>
        </div>

        {showCreate && (
          <motion.div 
            className="create-form"
            ref={createFormRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form className="location-form" onSubmit={handleCreateRide}>
              <div className="form-row">
                <AddressInput
                  value={form.from}
                  onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value }))}
                  placeholder="From (e.g., Delhi, India)"
                  onAddressSelect={(address) => {
                    setForm((prev) => ({ ...prev, from: address.address }));
                    setFormCoords((prev) => ({ ...prev, from: address.lat && address.lng ? { lat: address.lat, lng: address.lng } : null }));
                  }}
                  name="from"
                />
                <AddressInput
                  value={form.to}
                  onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))}
                  placeholder="To (e.g., Mumbai, India)"
                  onAddressSelect={(address) => {
                    setForm((prev) => ({ ...prev, to: address.address }));
                    setFormCoords((prev) => ({ ...prev, to: address.lat && address.lng ? { lat: address.lat, lng: address.lng } : null }));
                  }}
                  name="to"
                />
              </div>
              {/* Show mini map if both addresses are filled */}
              {form.from && form.to && (
                <div className="mini-map" style={{ marginBottom: '1rem' }}>
                  <RideCardMap 
                    fromAddress={form.from} 
                    toAddress={form.to} 
                    rideId={`create-preview-${form.from}-${form.to}`}
                    key={`create-preview-${form.from}-${form.to}`}
                  />
                </div>
              )}
              <div className="form-row">
                <input 
                  type="datetime-local" 
                  className="location-form-input"
                  value={form.time}
                  onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                />
                <input 
                  type="number" 
                  min="1" 
                  max="8" 
                  placeholder="Available Seats" 
                  className="location-form-input"
                  value={form.seats}
                  onChange={(e) => setForm((prev) => ({ ...prev, seats: Number(e.target.value) }))}
                />
              </div>
              <input 
                type="text" 
                placeholder="Note (optional)" 
                className="location-form-input"
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              />
              <button type="submit" className="submit-btn">
                Create Ride
              </button>
            </form>
          </motion.div>
        )}

        {error && <div className="error">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading rides...</div>
        ) : (
          <div className="rides-section">
            <h2 className="rides-title">Available Rides</h2>
            {(rides.length === 0 ? sampleRides : rides).length === 0 ? (
              <div className="no-rides">No rides available. Be the first to offer a ride!</div>
            ) : (
              <motion.div 
                className="rides-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {(rides.length === 0 ? sampleRides : rides).map((ride, index) => {
                  // Handle different possible data structures
                  const creator = ride.user || ride.creator || { username: 'Unknown', profilePhoto: null, _id: null };
                  let members = ride.members || ride.passengers || [];
                  // Ensure creator is always in the members list
                  const creatorId = creator._id?.toString() || creator.id?.toString();
                  if (creatorId && !members.some(m => (m.user?._id || m._id)?.toString() === creatorId)) {
                    members = [creator, ...members];
                  }
                  const fromAddress = ride.from || ride.currentLocation?.address || 'Unknown';
                  const toAddress = ride.to || ride.destination?.address || 'Unknown';
                  const departureTime = ride.time || ride.departureTime;
                  const maxSeats = ride.seats || ride.maxPassengers || 1;
                  const currentSeats = members.length;
                  const distance = ride.distance || 'N/A';
                  const travelTime = ride.travelTime || 'N/A';
                  const weather = ride.weather || 'N/A';
                  const note = ride.note || ride.notice || '';
                  
                  return (
                    <motion.div
                      key={ride._id}
                      className="ride-card-border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <div className="ride-card">
                        <div className="ride-header">
                          <div className="ride-creator">
                            <img 
                              src={`${import.meta.env.VITE_API_BASE}${creator.profilePhoto}`}
                              alt={creator.username}
                              className="creator-avatar"
                            />
                            <div className="creator-info">
                              <h3>{creator.username}</h3>
                              <p>@{creator.username}</p>
                            </div>
                          </div>
                          <div className="ride-status">
                            {currentSeats < maxSeats ? 'Available' : 'Full'}
                          </div>
                        </div>

                        <div className="ride-route">
                          <div className="route-points">
                            <div className="route-point">{fromAddress}</div>
                            <div className="route-arrow">→</div>
                            <div className="route-point">{toAddress}</div>
                          </div>
                          <div className="route-info">
                            <span>{distance} km</span>
                            <span>{travelTime} min</span>
                          </div>
                        </div>

                          {/* Google Maps Mini Map for each ride */}
                          <div className="mini-map">
                            <RideCardMap 
                              fromAddress={fromAddress}
                              toAddress={toAddress}
                              rideId={ride._id}
                            />
                          </div>

                        <div className="ride-details">
                          <div className="detail-item">
                            <span className="detail-label">Departure</span>
                            <span className="detail-value">
                              {departureTime ? new Date(departureTime).toLocaleString() : 'TBD'}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Seats</span>
                            <span className="detail-value">{currentSeats}/{maxSeats}</span>
                          </div>
                        </div>

                        {note && (
                          <div className="ride-note">
                            <span className="note-label">Note:</span>
                            <span className="note-text">{note}</span>
                          </div>
                        )}

                        <div className="ride-members">
                          <div className="members-title">Members ({members.length})</div>
                          <div className="members-list">
                            {members.map((member, idx) => {
                              const memberData = member.user || member;
                              return (
                                <img 
                                  key={idx}
                                  src={`${import.meta.env.VITE_API_BASE}${memberData.profilePhoto}`}
                                  alt={memberData.username}
                                  className="member-avatar"
                                  title={memberData.username}
                                />
                              );
                            })}
                          </div>
                        </div>

                        <div className="ride-actions">
                          {/* If current user is the creator, show Cancel Ride */}
                          {creator._id === currentUser?._id ? (
                            <button 
                              className="action-btn leave-btn"
                              onClick={() => handleCancelRide(ride._id)}
                            >
                              Cancel Ride
                            </button>
                          ) : members.some(m => (m.user?._id || m._id) === currentUser?._id) ? (
                            <button 
                              className="action-btn leave-btn"
                              onClick={() => handleLeaveRide(ride._id)}
                            >
                              Leave Ride
                            </button>
                          ) : (
                            <button 
                              className="action-btn join-btn"
                              onClick={() => handleJoinRide(ride._id)}
                              disabled={currentSeats >= maxSeats}
                            >
                              Join Ride
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}
      </div>
      {/* Hardik Pawar Location Idea Card */}
      <div className="location-idea-card" style={{
        width: '90vw',
        marginLeft: 'calc(-45vw + 50%)',
        marginRight: 'calc(-45vw + 50%)',
        marginTop: '3rem',
        marginBottom: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(90deg, #232046 0%, #3b2f6b 100%)',
        borderRadius: '1.2rem',
        boxShadow: '0 2px 16px 0 #0002',
        minHeight: '180px',
        padding: '1.2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left: Idea Text */}
        <div className="location-idea-text" style={{ flex: 1, color: '#e0e7ff', fontStyle: 'italic', fontSize: '1.15rem', lineHeight: 1.6 }}>
          <TypewriterText text={"The idea for the location page came to me when I realized how many students struggle to find rides and connect with others nearby. I wanted to make it easy for everyone to share rides, save time, and build new friendships. PeerPath's location feature is all about making our journeys together more meaningful."} />
        </div>
        {/* Right: Hardik Pawar Card */}
        <div className="location-idea-person-card" style={{
          minWidth: 180,
          maxWidth: 220,
          background: 'rgba(76,29,149,0.85)',
          borderRadius: '1rem',
          boxShadow: '0 2px 12px 0 #0002',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 0.7rem',
          marginLeft: '2.5rem',
        }}>
          <div className="location-idea-photo" style={{ width: 100, height: 100, borderRadius: '0.7rem', overflow: 'hidden', marginBottom: '0.7rem', border: '2px solid #fff' }}>
            <img src="/Hardik.jpeg" alt="Hardik Pawar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="location-idea-name" style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>Hardik Pawar</div>
          <div className="location-idea-role" style={{ color: '#c4b5fd', fontSize: '0.95rem', marginTop: '0.2rem' }}>Idea Contributor</div>
        </div>
      </div>
      {/* Advanced Footer */}
      <AdvancedFooter />
    </div>
  );
} 