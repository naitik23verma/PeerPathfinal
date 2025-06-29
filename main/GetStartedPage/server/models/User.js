import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  expertise: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  doubtsSolved: {
    type: Number,
    default: 0
  },
  doubtsAsked: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  weeklyStats: [{
    week: String,
    doubtsSolved: Number,
    date: Date
  }],
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    default: ''
  },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to update weekly stats
userSchema.methods.updateWeeklyStats = function() {
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const weekKey = weekStart.toISOString().split('T')[0];
  
  const existingWeek = this.weeklyStats.find(stat => stat.week === weekKey);
  
  if (existingWeek) {
    existingWeek.doubtsSolved = this.doubtsSolved;
    existingWeek.date = now;
  } else {
    this.weeklyStats.push({
      week: weekKey,
      doubtsSolved: this.doubtsSolved,
      date: now
    });
  }
};

export default mongoose.model('User', userSchema); 