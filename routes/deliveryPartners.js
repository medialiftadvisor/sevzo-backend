const express = require('express');
const DeliveryPartner = require('../models/DeliveryPartner');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const partners = await DeliveryPartner.find().populate('wallet');
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

router.post('/', async (req, res) => {
  try {
    const partner = new DeliveryPartner(req.body);
    await partner.save();
    res.status(201).json(partner);
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
