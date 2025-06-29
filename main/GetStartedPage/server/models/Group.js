import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  profilePhoto: {
    type: String,
    default: ''
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Group', groupSchema); 