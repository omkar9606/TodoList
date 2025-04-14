const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
  },
  description: {
    type: String,
    maxLength: 500,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  category: {
    type: String,
    enum: ['Urgent', 'Non-Urgent'],
    default: 'Non-Urgent',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
todoSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Todo', todoSchema);