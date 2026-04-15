const express = require('express');
const DeliveryPartner = require('../models/DeliveryPartner');
const Wallet = require('../models/Wallet');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const query = {};
    if (email) {
      query.email = email.toLowerCase().trim();
    }
    const partners = await DeliveryPartner.find(query).populate('wallet');
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id).populate('wallet');
    if (!partner) return res.status(404).json({ error: 'Delivery partner not found' });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const partner = await DeliveryPartner.findOne({ email: email.toLowerCase().trim() }).populate('wallet');
    if (!partner || partner.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    return res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body, email: req.body.email?.toLowerCase()?.trim() };
    const partner = new DeliveryPartner(payload);
    await partner.save();

    const wallet = new Wallet({ ownerType: 'DeliveryPartner', ownerId: partner._id, balance: 0, currency: 'INR' });
    await wallet.save();

    partner.wallet = wallet._id;
    await partner.save();

    const savedPartner = await DeliveryPartner.findById(partner._id).populate('wallet');
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const partner = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!partner) return res.status(404).json({ error: 'Delivery partner not found' });
    res.json(partner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const partner = await DeliveryPartner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Delivery partner not found' });
    res.json({ message: 'Delivery partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
