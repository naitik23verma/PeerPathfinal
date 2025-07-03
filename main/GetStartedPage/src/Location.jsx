import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import NavigationBar from './components/NavigationBar.jsx';
import './Location.css';
import axios from 'axios';
import DotGrid from "./components/DotGrid.jsx";
import AdvancedFooter from './components/AdvancedFooter.jsx';
import TypewriterText from './components/TypewriterText.jsx';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API_URL = 'https://peerpathfinal.onrender.com/api/location';
const GOOGLE_MAPS_API_KEY = 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg';

// Map display using react-leaflet
const RideCardMap = ({ fromAddress, toAddress, rideId }) => {
  // fromAddress and toAddress should have coordinates: [lon, lat]
  if (!fromAddress?.coordinates || !toAddress?.coordinates) return null;
  const from = [fromAddress.coordinates[1], fromAddress.coordinates[0]];
  const to = [toAddress.coordinates[1], toAddress.coordinates[0]];
  return (
    <MapContainer center={from} zoom={10} scrollWheelZoom={false} style={{ height: '150px', width: '100%', borderRadius: '8px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={from} />
      <Marker position={to} />
      <Polyline positions={[from, to]} color="#8b5cf6" weight={4} />
    </MapContainer>
  );
};

const SimpleMap = ({ fromAddress, toAddress }) => {
  if (!fromAddress?.coordinates || !toAddress?.coordinates) return null;
  const from = [fromAddress.coordinates[1], fromAddress.coordinates[0]];
  const to = [toAddress.coordinates[1], toAddress.coordinates[0]];
  return (
    <MapContainer center={from} zoom={10} scrollWheelZoom={false} style={{ height: '200px', width: '100%', borderRadius: '8px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={from} />
      <Marker position={to} />
      <Polyline positions={[from, to]} color="#8b5cf6" weight={4} />
    </MapContainer>
  );
};

// Helper for Nominatim autocomplete
const fetchNominatimSuggestions = async (query) => {
  if (!query) return [];
  let url;
  if (window.location.hostname === 'localhost') {
    url = `https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  } else {
    url = `/api/geocode?q=${encodeURIComponent(query)}`;
  }
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.map(item => ({
    display_name: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
  }));
};

// AddressInput component using Nominatim
const AddressInput = ({ value, onChange, placeholder, onAddressSelect, name, className = '' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value?.address || '');

  useEffect(() => {
    setInputValue(value?.address || '');
  }, [value]);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange && onChange({ address: val });
    if (val.length > 2) {
      const results = await fetchNominatimSuggestions(val);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    onAddressSelect && onAddressSelect({
      address: suggestion.display_name,
      coordinates: suggestion.coordinates
    });
  };

  return (
    <div className={`address-input-container ${className}`.trim()}>
      <input
        type="text"
        className="address-input"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        autoComplete="off"
        name={name}
        onFocus={() => setShowSuggestions(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="address-suggestions">
          {suggestions.map((s, idx) => (
            <li key={idx} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
              <span className="suggestion-text">{s.display_name}</span>
            </li>
          ))}
        </ul>
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
    from: { address: '', coordinates: null },
    to: { address: '', coordinates: null },
    time: '',
    seats: 1,
    note: ''
  });

  // Add error boundary
  const [hasError, setHasError] = useState(false);

  // Error handling effect
  useEffect(() => {
    const handleError = (error) => {
      console.error('Location page error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

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
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Fetched rides data:', res.data);
      setRides(res.data.locations || res.data || []);
    } catch (e) {
      console.error('Error fetching rides:', e);
      setError('Failed to load rides. Using sample data.');
      // Use sample data if API fails
      setRides(sampleRides);
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
    if (!form.from.address || !form.to.address || !form.time || !form.seats || !form.from.coordinates || !form.to.coordinates) {
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
            coordinates: form.from.coordinates,
            address: form.from.address
          },
          destination: {
            coordinates: form.to.coordinates,
            address: form.to.address
          },
          departureTime: form.time,
          notice: form.note,
          maxPassengers: form.seats
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCreate(false);
      setForm({ from: { address: '', coordinates: null }, to: { address: '', coordinates: null }, time: '', seats: 1, note: '' });
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
      [field]: {
        ...prev[field],
        address: address.address,
        coordinates: address.coordinates
      }
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

  // Error boundary
  if (hasError) {
    return (
      <div className="location-page" style={{ position: 'relative', overflow: 'hidden' }}>
        <NavigationBar 
          currentUser={currentUser}
          onLogout={onLogout}
          showUserInfo={true}
          showNotifications={true}
          showSearch={false}
        />
        <div className="location-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Something went wrong</h2>
            <p>Please refresh the page or try again later.</p>
            <button onClick={() => window.location.reload()} style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  onChange={(e) => setForm((prev) => ({ ...prev, from: { ...prev.from, address: e.address } }))}
                  placeholder="From (e.g., Delhi, India)"
                  onAddressSelect={(address) => setForm((prev) => ({ ...prev, from: { address: address.address, coordinates: address.coordinates } }))}
                  name="from"
                />
                <AddressInput
                  value={form.to}
                  onChange={(e) => setForm((prev) => ({ ...prev, to: { ...prev.to, address: e.address } }))}
                  placeholder="To (e.g., Mumbai, India)"
                  onAddressSelect={(address) => setForm((prev) => ({ ...prev, to: { address: address.address, coordinates: address.coordinates } }))}
                  name="to"
                />
              </div>
              {/* Show mini map if both addresses are filled */}
              {form.from.address && form.to.address && form.from.coordinates && form.to.coordinates && (
                <div className="mini-map" style={{ marginBottom: '1rem' }}>
                  <RideCardMap 
                    fromAddress={form.from} 
                    toAddress={form.to} 
                    rideId={`create-preview-${form.from.address}-${form.to.address}`}
                    key={`create-preview-${form.from.address}-${form.to.address}`}
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
                            <span>{distance !== 'N/A' ? distance : 'Calculating...'}</span>
                            <span>{travelTime !== 'N/A' ? travelTime : 'Calculating...'}</span>
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