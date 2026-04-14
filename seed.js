const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const DeliveryPartner = require('./models/DeliveryPartner');
const Admin = require('./models/Admin');
const Inventory = require('./models/Inventory');
const Wallet = require('./models/Wallet');
const Order = require('./models/Order');

const mongoURI = process.env.MONGO_URI || 'mongodb://medialiftadvisor_db_user:ZTyxx80DLkzTf2g5@ac-3ormxhn-shard-00-00.ab5rsbm.mongodb.net:27017,ac-3ormxhn-shard-00-01.ab5rsbm.mongodb.net:27017,ac-3ormxhn-shard-00-02.ab5rsbm.mongodb.net:27017/?ssl=true&replicaSet=atlas-tt5ccd-shard-0&authSource=admin&appName=mla';

async function seed() {
  await mongoose.connect(mongoURI);

  const inventoryItems = [
    { productName: 'Fresh Tomatoes', sku: 'VEG001', description: 'Juicy red tomatoes', category: 'Vegetables & Fruits', stock: 120, price: 35, cost: 22 },
    { productName: 'Organic Wheat Atta', sku: 'GRA001', description: 'Whole wheat flour', category: 'Atta, Rice & Dal', stock: 80, price: 55, cost: 40 },
    { productName: 'Sunflower Oil', sku: 'OIL001', description: 'Cold pressed oil', category: 'Oil, Ghee & Masala', stock: 40, price: 180, cost: 140 },
    { productName: 'Farm Fresh Milk', sku: 'DAI001', description: 'Pure dairy milk', category: 'Dairy & Eggs', stock: 70, price: 52, cost: 38 },
    { productName: 'Fresh Spinach', sku: 'VEG002', description: 'Green leafy spinach', category: 'Vegetables & Fruits', stock: 90, price: 28, cost: 18 },
    { productName: 'Basmati Rice', sku: 'GRA002', description: 'Premium long-grain rice', category: 'Atta, Rice & Dal', stock: 100, price: 120, cost: 88 },
    { productName: 'Garam Masala', sku: 'MAS001', description: 'Aromatic Indian spice blend', category: 'Oil, Ghee & Masala', stock: 60, price: 95, cost: 70 },
    { productName: 'Paneer Cubes', sku: 'DAI002', description: 'Soft cottage cheese', category: 'Dairy & Eggs', stock: 50, price: 110, cost: 85 },
    { productName: 'Red Lentils', sku: 'GRA003', description: 'Nutritious masoor dal', category: 'Atta, Rice & Dal', stock: 75, price: 90, cost: 65 },
    { productName: 'Ghee Jar', sku: 'OIL002', description: 'Pure cow ghee', category: 'Oil, Ghee & Masala', stock: 45, price: 410, cost: 310 }
  ];

  const [user, partner, admin] = await Promise.all([
    User.findOneAndUpdate(
      { email: 'customer@sevzo.app' },
      { name: 'Sevzo Customer', email: 'customer@sevzo.app', password: 'password123', phone: '9999999999', role: 'customer' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    DeliveryPartner.findOneAndUpdate(
      { email: 'partner@sevzo.app' },
      { name: 'Sevzo Partner', email: 'partner@sevzo.app', password: 'password123', phone: '9888888888', vehicleType: 'Bike', status: 'active' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    Admin.findOneAndUpdate(
      { email: 'admin@sevzo.app' },
      { name: 'Sevzo Admin', email: 'admin@sevzo.app', password: 'admin123', role: 'admin' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  ]);

  const wallets = await Promise.all([
    Wallet.findOneAndUpdate({ ownerType: 'User', ownerId: user._id }, { ownerType: 'User', ownerId: user._id, balance: 250 }, { upsert: true, new: true, setDefaultsOnInsert: true }),
    Wallet.findOneAndUpdate({ ownerType: 'DeliveryPartner', ownerId: partner._id }, { ownerType: 'DeliveryPartner', ownerId: partner._id, balance: 120 }, { upsert: true, new: true, setDefaultsOnInsert: true }),
    Wallet.findOneAndUpdate({ ownerType: 'Admin', ownerId: admin._id }, { ownerType: 'Admin', ownerId: admin._id, balance: 0 }, { upsert: true, new: true, setDefaultsOnInsert: true })
  ]);

  const inventory = await Inventory.deleteMany({});
  const createdInventory = await Inventory.insertMany(inventoryItems);

  const order = await Order.findOneAndUpdate(
    { orderNumber: 'ORD1001' },
    {
      orderNumber: 'ORD1001',
      user: user._id,
      deliveryPartner: partner._id,
      items: createdInventory.slice(0, 2).map(item => ({ inventory: item._id, name: item.productName, quantity: 2, price: item.price, total: item.price * 2 })),
      totalAmount: createdInventory[0].price * 2 + createdInventory[1].price * 2,
      paymentMethod: 'wallet',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      shippingAddress: {
        line1: '123 Sevzo Street',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302001',
        country: 'India'
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Seed data applied successfully:', {
    user: user.email,
    partner: partner.email,
    admin: admin.email,
    inventoryCount: createdInventory.length,
    orderNumber: order.orderNumber
  });

  await mongoose.connection.close();
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});