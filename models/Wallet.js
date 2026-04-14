const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  reference: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema({
  ownerType: { type: String, required: true, enum: ['User', 'DeliveryPartner', 'Admin'] },
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'ownerType' },
  balance: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'INR' },
  transactions: [transactionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wallet', walletSchema);
