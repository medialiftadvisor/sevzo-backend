const express = require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Wallet = require('../models/Wallet');
const DeliveryPartner = require('../models/DeliveryPartner');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    return res.json({
      token: process.env.ADMIN_SECRET || 'sevzo-admin-secret',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isSuperAdmin: admin.isSuperAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(adminAuth);

router.get('/dashboard', async (req, res) => {
  try {
    const [users, orders, inventory, wallets, partners, admins] = await Promise.all([
      User.find(),
      Order.find(),
      Inventory.find(),
      Wallet.find(),
      DeliveryPartner.find(),
      Admin.find()
    ]);

    res.json({ users, orders, inventory, wallets, partners, admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
