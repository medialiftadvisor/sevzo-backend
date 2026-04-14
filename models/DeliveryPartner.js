const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  vehicleType: { type: String, trim: true },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  isAvailable: { type: Boolean, default: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'active', 'inactive'] },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryPartner', partnerSchema);
