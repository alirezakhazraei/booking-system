const mongoose = require('mongoose');

// Represents a recurring weekly availability window for a provider
// e.g. dayOfWeek: 1 (Monday), startTime: "09:00", endTime: "17:00"
const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dayOfWeek: {
      type: Number, // 0 = Sunday ... 6 = Saturday
      required: true,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String, // "HH:mm" 24h format
      required: true,
    },
    endTime: {
      type: String, // "HH:mm" 24h format
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);
