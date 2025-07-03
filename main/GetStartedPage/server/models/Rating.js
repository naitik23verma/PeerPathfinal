import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  email: {
    type: String,
    required: false,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Rating', ratingSchema); 