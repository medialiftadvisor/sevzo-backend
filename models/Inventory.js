const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  sku: { type: String, trim: true, unique: true },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, min: 0 },
  vendor: { type: String, trim: true },
  images: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);
