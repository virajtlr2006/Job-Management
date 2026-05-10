const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String],
  salary: {
    type: String,
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance'],
    default: 'full-time',
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'draft'],
    default: 'open',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applications: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'accepted', 'rejected'],
      default: 'applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Job', jobSchema);