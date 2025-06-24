import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentLocation: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  destination: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  departureTime: {
    type: Date,
    required: true
  },
  notice: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contactInfo: {
    phone: String,
    email: String
  },
  maxPassengers: {
    type: Number,
    default: 3,
    min: 1,
    max: 10
  },
  currentPassengers: {
    type: Number,
    default: 0
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
locationSchema.index({ currentLocation: '2dsphere' });
locationSchema.index({ destination: '2dsphere' });

// Method to add passenger
locationSchema.methods.addPassenger = async function(userId) {
  if (this.currentPassengers >= this.maxPassengers) {
    throw new Error('Ride is full');
  }
  
  const existingPassenger = this.passengers.find(passenger => 
    passenger.user.toString() === userId.toString()
  );
  
  if (existingPassenger) {
    throw new Error('User is already a passenger');
  }
  
  this.passengers.push({
    user: userId
  });
  
  this.currentPassengers = this.passengers.length;
  await this.save();
  return this.populate('user passengers.user');
};

// Method to remove passenger
locationSchema.methods.removePassenger = async function(userId) {
  const initialLength = this.passengers.length;
  this.passengers = this.passengers.filter(passenger => 
    passenger.user.toString() !== userId.toString()
  );
  
  if (initialLength === this.passengers.length) {
    throw new Error('User is not a passenger in this ride');
  }
  
  this.currentPassengers = this.passengers.length;
  await this.save();
  return this.populate('user passengers.user');
};

// Method to cancel ride
locationSchema.methods.cancelRide = async function() {
  this.isActive = false;
  await this.save();
  return this.populate('user passengers.user');
};

// Pre-save middleware to update currentPassengers
locationSchema.pre('save', function(next) {
  this.currentPassengers = this.passengers.length;
  next();
});

export default mongoose.model('Location', locationSchema); 