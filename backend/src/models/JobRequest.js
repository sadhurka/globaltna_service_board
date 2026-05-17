const mongoose = require('mongoose');

// JobRequest schema for service requests
const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title must be 120 characters or fewer'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
    enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Roofing', 'Flooring', 'Other'],
    },
    location: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
  }
);

// Text index for keyword search (bonus)
jobRequestSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('JobRequest', jobRequestSchema, 'jobRequests');
