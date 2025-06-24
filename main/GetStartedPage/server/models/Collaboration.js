import mongoose from 'mongoose';

const collaborationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      default: 'member'
    }
  }],
  maxMembers: {
    type: Number,
    default: 10
  },
  category: {
    type: String,
    required: true
  },
  skills: [String],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to add member
collaborationSchema.methods.addMember = function(userId) {
  if (this.members.length >= this.maxMembers) {
    throw new Error('Project is full');
  }
  
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('User is already a member');
  }
  
  this.members.push({
    user: userId,
    role: 'member'
  });
  
  return this.save();
};

// Method to remove member
collaborationSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
  return this.save();
};

export default mongoose.model('Collaboration', collaborationSchema); 