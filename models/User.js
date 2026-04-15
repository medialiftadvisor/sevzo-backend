const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: { type: String, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  address: addressSchema,
  role: { type: String, default: 'customer', enum: ['customer', 'user'] },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'blocked'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
