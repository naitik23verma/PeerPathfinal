import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  solutions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    isAccepted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to increment views
doubtSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add solution
doubtSchema.methods.addSolution = function(userId, content) {
  this.solutions.push({
    user: userId,
    content: content
  });
  return this.save();
};

// Method to accept solution
doubtSchema.methods.acceptSolution = function(solutionId) {
  const solution = this.solutions.id(solutionId);
  if (solution) {
    solution.isAccepted = true;
    this.isSolved = true;
    return this.save();
  }
  throw new Error('Solution not found');
};

export default mongoose.model('Doubt', doubtSchema); 