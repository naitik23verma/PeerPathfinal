import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('ChatMessage', chatMessageSchema); 