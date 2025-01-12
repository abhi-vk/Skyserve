const mongoose = require('mongoose');

// Schema to store drawn shapes and points data
const savedDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Store GeoJSON data
    required: true,
  },
  name: {
    type: String,
    default: "Untitled Data",
  },
  description: {
    type: String,
    default: "No description available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const SavedData = mongoose.model('SavedData', savedDataSchema);

module.exports = SavedData;
