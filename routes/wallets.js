const express = require('express');
const Wallet = require('../models/Wallet');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { ownerType, ownerId } = req.query;
    const query = {};

    if (ownerType) query.ownerType = ownerType;
    if (ownerId) query.ownerId = ownerId;

    const wallets = await Wallet.find(query);
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id).populate('ownerId');
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const wallet = new Wallet(req.body);
    await wallet.save();
    res.status(201).json(wallet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json(wallet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const wallet = await Wallet.findByIdAndDelete(req.params.id);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
