import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from './components/NavigationBar.jsx';
import './Location.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/location';
const GOOGLE_MAPS_API_KEY = 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg'; // Replace with your actual API key
const WEATHER_API_KEY = '8c4c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0'; // Replace with your actual OpenWeatherMap API key

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

export default function Location({ currentUser, onLogout }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [weather, setWeather] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [form, setForm] = useState({
    from: '',
    to: '',
    time: '',
    seats: 1,
    note: ''
  });
  const [routeData, setRouteData] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocationAddress, setCurrentLocationAddress] = useState('');
  const mapRef = useRef(null);
  const [creatingRide, setCreatingRide] = useState(false);
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);

  useEffect(() => {
    fetchRides();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (showMap && routeData && mapRef.current && !mapInstance) {
      initializeMap();
    }
  }, [showMap, routeData, mapRef.current]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setRides(res.data.locations || []);
    } catch (e) {
      setError('Failed to load rides.');
      console.error('Error fetching rides:', e);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          
          // Get address for current location using Google Geocoding
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              setCurrentLocationAddress(data.results[0].formatted_address);
            }
          } catch (error) {
            console.error('Error getting current location address:', error);
          }
        },
        () => setUserLocation(null)
      );
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    console.log('Form updated:', updatedForm);
    
    // Get route data when both from and to are filled
    if (name === 'from' || name === 'to') {
      if (updatedForm.from && updatedForm.to) {
        console.log('Both addresses filled from input, getting route data');
        getRouteData(updatedForm.from, updatedForm.to);
      }
    }
  };

  const handleAddressSelect = (field, addressData) => {
    console.log('Address selected for field:', field, 'data:', addressData);
    
    if (field === 'from') {
      setFromCoords({ lat: addressData.lat, lng: addressData.lng });
      // Update form state with the selected address
      const updatedForm = { ...form, from: addressData.address };
      setForm(updatedForm);
      console.log('Updated form with from address:', updatedForm);
      // Only get route data if both fields are filled
      if (updatedForm.to) {
        console.log('Both addresses filled, getting route data');
        getRouteData(addressData.address, updatedForm.to);
      }
    } else if (field === 'to') {
      setToCoords({ lat: addressData.lat, lng: addressData.lng });
      // Update form state with the selected address
      const updatedForm = { ...form, to: addressData.address };
      setForm(updatedForm);
      console.log('Updated form with to address:', updatedForm);
      // Only get route data if both fields are filled
      if (updatedForm.from) {
        console.log('Both addresses filled, getting route data');
        getRouteData(updatedForm.from, addressData.address);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (useCurrentLocation && currentLocationAddress) {
      const updatedForm = { ...form, from: currentLocationAddress };
      setForm(updatedForm);
      if (updatedForm.to) {
        getRouteData(updatedForm.from, updatedForm.to);
      }
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, [useCurrentLocation, currentLocationAddress]);

  const getRouteData = async (from, to) => {
    try {
      console.log('Getting route data for:', from, 'to:', to);
      
      if (!from || !to) {
        console.log('Missing from or to address');
        setRouteData(null);
        return;
      }
      
      // Use coordinates if available for more precise routing
      let origin = from;
      let destination = to;
      
      if (fromCoords && from === form.from) {
        origin = `${fromCoords.lat},${fromCoords.lng}`;
      }
      if (toCoords && to === form.to) {
        destination = `${toCoords.lat},${toCoords.lng}`;
      }
      
      console.log('Using origin:', origin, 'destination:', destination);
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      console.log('Route data response:', data);
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        const routeInfo = {
          distance: (leg.distance.value / 1000).toFixed(1),
          travelTime: Math.round(leg.duration.value / 60),
          fromCoords: {
            lat: leg.start_location.lat,
            lng: leg.start_location.lng,
            address: leg.start_address
          },
          toCoords: {
            lat: leg.end_location.lat,
            lng: leg.end_location.lng,
            address: leg.end_address
          }
        };
        
        console.log('Route info:', routeInfo);
        setRouteData(routeInfo);
        
        // Get weather for destination
        await getWeather(leg.end_location.lat, leg.end_location.lng);
      } else {
        console.error('No routes found in response, trying fallback');
        // Fallback: create route data with available coordinates
        await createFallbackRouteData(from, to);
      }
    } catch (error) {
      console.error('Error getting route data:', error);
      // Fallback: create route data with available coordinates
      await createFallbackRouteData(from, to);
    }
  };

  const createFallbackRouteData = async (from, to) => {
    try {
      console.log('Creating fallback route data');
      
      // Use available coordinates or get them from geocoding
      let fromLat = 20.5937, fromLng = 78.9629; // Default to India center
      let toLat = 20.5937, toLng = 78.9629;
      
      if (fromCoords) {
        fromLat = fromCoords.lat;
        fromLng = fromCoords.lng;
      } else {
        // Try to geocode the from address
        const fromResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(from)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const fromData = await fromResponse.json();
        if (fromData.results && fromData.results[0]) {
          fromLat = fromData.results[0].geometry.location.lat;
          fromLng = fromData.results[0].geometry.location.lng;
        }
      }
      
      if (toCoords) {
        toLat = toCoords.lat;
        toLng = toCoords.lng;
      } else {
        // Try to geocode the to address
        const toResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(to)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const toData = await toResponse.json();
        if (toData.results && toData.results[0]) {
          toLat = toData.results[0].geometry.location.lat;
          toLng = toData.results[0].geometry.location.lng;
        }
      }
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        { lat: fromLat, lng: fromLng },
        { lat: toLat, lng: toLng }
      );
      
      const routeInfo = {
        distance: distance.toFixed(1),
        travelTime: Math.round(distance * 2), // Rough estimate: 2 min per km
        fromCoords: {
          lat: fromLat,
          lng: fromLng,
          address: from
        },
        toCoords: {
          lat: toLat,
          lng: toLng,
          address: to
        }
      };
      
      console.log('Fallback route info:', routeInfo);
      setRouteData(routeInfo);
      
      // Get weather for destination
      await getWeather(toLat, toLng);
      
    } catch (error) {
      console.error('Error creating fallback route data:', error);
      setRouteData(null);
    }
  };

  const getWeather = async (lat, lng) => {
    try {
      console.log('Getting weather for:', lat, lng);
      
      // Using OpenWeatherMap API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      
      console.log('Weather response:', data);
      
      if (data.cod === 200) {
        setWeather(data);
      } else {
        console.error('Weather API error:', data.message);
        setWeather(null);
      }
    } catch (error) {
      console.error('Error getting weather:', error);
      setWeather(null);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstance) return;

    // Load Google Maps script if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => createMap();
      document.head.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: 20.5937, lng: 78.9629 },
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
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

      // Display route if we have route data
      if (routeData) {
        displayRoute(directionsService, directionsRenderer);
      }

    } catch (error) {
      console.error('Error creating map:', error);
    }
  };

  const displayRoute = (service, renderer) => {
    if (!routeData) return;

    const request = {
      origin: routeData.fromCoords.address,
      destination: routeData.toCoords.address,
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

  const handleCreateRide = async (e) => {
    e.preventDefault();
    setCreatingRide(true);
    setError('');
    
    try {
      console.log('Creating ride with form data:', form);
      console.log('Route data:', routeData);
      console.log('From coords:', fromCoords);
      console.log('To coords:', toCoords);
      
      // Validate form data
      if (!form.from || !form.to) {
        setError('Please enter both "From" and "To" addresses.');
        setCreatingRide(false);
        return;
      }
      
      if (!form.time) {
        setError('Please select departure time.');
        setCreatingRide(false);
        return;
      }
      
      if (!routeData) {
        setError('Please enter valid addresses to create a ride. Make sure both addresses are recognized.');
        setCreatingRide(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login again.');
        setCreatingRide(false);
        return;
      }
      
      const rideData = {
        currentLocation: { 
          address: form.from,
          coordinates: [routeData.fromCoords.lat, routeData.fromCoords.lng]
        },
        destination: { 
          address: form.to,
          coordinates: [routeData.toCoords.lat, routeData.toCoords.lng]
        },
        departureTime: form.time,
        maxPassengers: parseInt(form.seats),
        notice: form.note
      };
      
      console.log('Sending ride data to server:', rideData);
      
      const response = await axios.post(API_URL, rideData, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      
      console.log('Server response:', response.data);
      
      // Reset form and close create section
      setShowCreate(false);
      setForm({ from: '', to: '', time: '', seats: 1, note: '' });
      setRouteData(null);
      setWeather(null);
      setFromCoords(null);
      setToCoords(null);
      
      // Refresh rides list
      await fetchRides();
      
    } catch (e) {
      console.error('Error creating ride:', e);
      if (e.response) {
        setError(`Failed to create ride: ${e.response.data.message || e.response.statusText}`);
      } else if (e.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to create ride. Please try again.');
      }
    } finally {
      setCreatingRide(false);
    }
  };

  const handleJoinRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/${rideId}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchRides();
    } catch (e) {
      setError('Failed to join ride.');
      console.error('Error joining ride:', e);
    }
  };

  const handleLeaveRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/${rideId}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchRides();
    } catch (e) {
      setError('Failed to leave ride.');
      console.error('Error leaving ride:', e);
    }
  };

  const handleCancelRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${rideId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchRides();
    } catch (e) {
      setError('Failed to cancel ride.');
      console.error('Error canceling ride:', e);
    }
  };

  const getWeatherIcon = (weatherCode) => {
    const icons = {
      '01': '☀️', '02': '⛅', '03': '☁️', '04': '☁️',
      '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '🌨️', '50': '🌫️'
    };
    return icons[weatherCode.substring(0, 2)] || '🌤️';
  };

  const calculateDistance = (from, to) => {
    const R = 6371; // Earth's radius in km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLon = (to.lng - from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getRideDistance = (ride) => {
    if (!userLocation || !ride.currentLocation?.coordinates || ride.currentLocation.coordinates.length !== 2) {
      return null;
    }
    
    const rideCoords = {
      lat: ride.currentLocation.coordinates[0],
      lng: ride.currentLocation.coordinates[1]
    };
    
    return calculateDistance(userLocation, rideCoords).toFixed(1);
  };

  const getRideRouteDistance = (ride) => {
    if (!ride.currentLocation?.coordinates || !ride.destination?.coordinates ||
        ride.currentLocation.coordinates.length !== 2 || ride.destination.coordinates.length !== 2) {
      return null;
    }
    
    const fromCoords = {
      lat: ride.currentLocation.coordinates[0],
      lng: ride.currentLocation.coordinates[1]
    };
    
    const toCoords = {
      lat: ride.destination.coordinates[0],
      lng: ride.destination.coordinates[1]
    };
    
    return calculateDistance(fromCoords, toCoords).toFixed(1);
  };

  return (
    <div className="location-page">
      <NavigationBar 
        currentUser={currentUser} 
        onLogout={onLogout} 
        showUserInfo={true}
        showNotifications={true}
        showSearch={false}
      />
      
      {/* Hero Animation Section */}
      <motion.div className="location-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="hero-animation">
          <motion.div className="car car-1" animate={{ x: [0, 100, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            🚗
          </motion.div>
          <motion.div className="connection-line" animate={{ scaleX: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="line"></div>
            <div className="peer-icon">👥</div>
          </motion.div>
          <motion.div className="car car-2" animate={{ x: [0, -100, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>
            🚗
          </motion.div>
        </div>
        <h1 className="hero-title">Connect & Travel Together</h1>
        <p className="hero-subtitle">Find rides, share journeys, and make new connections</p>
      </motion.div>

      <motion.div className="location-main" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="location-actions">
          <button className="create-btn" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Cancel' : 'Offer a Ride'}
          </button>
        </div>

        {showCreate && (
          <motion.div className="create-ride-section" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <form className="location-form" onSubmit={handleCreateRide}>
              <div className="form-row">
                <div className="input-group">
                  <AddressInput
                    value={form.from}
                    onChange={handleInput}
                    placeholder="From (Start typing for suggestions)"
                    onAddressSelect={(addressData) => handleAddressSelect('from', addressData)}
                    name="from"
                    className="location-form-input"
                  />
                  {currentLocationAddress && (
                    <label className="current-location-checkbox">
                      <input 
                        type="checkbox" 
                        checked={useCurrentLocation}
                        onChange={(e) => setUseCurrentLocation(e.target.checked)}
                      />
                      Use my current location
                    </label>
                  )}
                </div>
                <AddressInput
                  value={form.to}
                  onChange={handleInput}
                  placeholder="To (Start typing for suggestions)"
                  onAddressSelect={(addressData) => handleAddressSelect('to', addressData)}
                  name="to"
                  className="location-form-input"
                />
              </div>
              <div className="form-row">
                <input name="time" value={form.time} onChange={handleInput} type="datetime-local" required />
                <input name="seats" value={form.seats} onChange={handleInput} type="number" min={1} max={8} placeholder="Available Seats" required />
              </div>
              <input name="note" value={form.note} onChange={handleInput} placeholder="Note (optional)" />
              
              {/* Manual route calculation button */}
              {form.from && form.to && !routeData && (
                <button 
                  type="button" 
                  className="calculate-route-btn"
                  onClick={() => getRouteData(form.from, form.to)}
                >
                  Calculate Route
                </button>
              )}
              
              <button type="submit" className="submit-btn" disabled={creatingRide}>
                {creatingRide ? 'Creating Ride...' : 'Create Ride'}
              </button>
            </form>

            {routeData && (
              <motion.div className="route-map-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="map-container">
                  <SimpleMap 
                    fromAddress={routeData.fromCoords.address}
                    toAddress={routeData.toCoords.address}
                  />
                  <div className="route-info">
                    <div className="route-detail">
                      <span className="label">Distance:</span>
                      <span className="value">{routeData.distance} km</span>
                    </div>
                    <div className="route-detail">
                      <span className="label">Travel Time:</span>
                      <span className="value">~{routeData.travelTime} min</span>
                    </div>
                    {weather && (
                      <div className="route-detail">
                        <span className="label">Weather at Destination:</span>
                        <span className="value">
                          {getWeatherIcon(weather.weather[0].icon)} {weather.main.temp}°C, {weather.weather[0].main}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {error && <div className="location-error">{error}</div>}
        
        {loading ? (
          <div className="location-loading">Loading rides...</div>
        ) : (
          <div className="rides-section">
            <h2 className="rides-title">Available Rides</h2>
            <div className="rides-list">
              {rides.length === 0 ? (
                <div className="no-rides">No rides available. Be the first to offer a ride!</div>
              ) : (
                rides.map((ride) => {
                  const userDistance = getRideDistance(ride);
                  const routeDistance = getRideRouteDistance(ride);
                  
                  return (
                    <motion.div className="ride-card" key={ride._id} whileHover={{ scale: 1.02, y: -5 }}>
                      <div className="ride-header">
                        <div className="ride-creator">
                          <img src={ride.user?.profilePhoto || '/peerpath.png'} alt={ride.user?.username} />
                          <span>{ride.user?.username}</span>
                        </div>
                        <div className="ride-status">
                          <span className={`status ${ride.isActive ? 'active' : 'inactive'}`}>
                            {ride.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ride-route">
                        <div className="route-point">
                          <span className="point-label">From:</span>
                          <span className="point-address">{ride.currentLocation?.address}</span>
                        </div>
                        <div className="route-arrow">→</div>
                        <div className="route-point">
                          <span className="point-label">To:</span>
                          <span className="point-address">{ride.destination?.address}</span>
                        </div>
                      </div>

                      {/* Google Maps Mini Map for each ride */}
                      <div className="ride-map-container">
                        <SimpleMap 
                          fromAddress={ride.currentLocation?.address}
                          toAddress={ride.destination?.address}
                        />
                      </div>

                      <div className="ride-details">
                        <div className="detail-item">
                          <span className="detail-label">Departure:</span>
                          <span className="detail-value">{new Date(ride.departureTime).toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Seats:</span>
                          <span className="detail-value">{ride.currentPassengers || 1}/{ride.maxPassengers}</span>
                        </div>
                        {routeDistance && (
                          <div className="detail-item">
                            <span className="detail-label">Route Distance:</span>
                            <span className="detail-value">{routeDistance} km</span>
                          </div>
                        )}
                        {userDistance && (
                          <div className="detail-item">
                            <span className="detail-label">Distance from you:</span>
                            <span className="detail-value">{userDistance} km</span>
                          </div>
                        )}
                      </div>

                      {ride.notice && (
                        <div className="ride-note">
                          <span className="note-label">Note:</span>
                          <span className="note-text">{ride.notice}</span>
                        </div>
                      )}

                      <div className="ride-members">
                        <h4>Ride Members:</h4>
                        <div className="members-list">
                          <div className="member creator">
                            <img src={ride.user?.profilePhoto || '/peerpath.png'} alt={ride.user?.username} />
                            <span>{ride.user?.username} (Creator)</span>
                          </div>
                          {ride.passengers && ride.passengers.map((passenger) => (
                            <div className="member" key={passenger.user._id}>
                              <img src={passenger.user.profilePhoto || '/peerpath.png'} alt={passenger.user.username} />
                              <span>{passenger.user.username}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="ride-actions">
                        {ride.user._id === currentUser._id ? (
                          <button className="cancel-btn" onClick={() => handleCancelRide(ride._id)}>
                            Cancel Ride
                          </button>
                        ) : (
                          <>
                            {ride.passengers?.some(p => p.user._id === currentUser._id) ? (
                              <button className="leave-btn" onClick={() => handleLeaveRide(ride._id)}>
                                Leave Ride
                              </button>
                            ) : (
                              <button 
                                className="join-btn" 
                                onClick={() => handleJoinRide(ride._id)}
                                disabled={ride.currentPassengers >= ride.maxPassengers}
                              >
                                Join Ride
                              </button>
                            )}
                            <button className="contact-btn">Contact</button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 