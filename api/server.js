const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRouter = require('../routes/users');
const deliveryPartnersRouter = require('../routes/deliveryPartners');
const adminsRouter = require('../routes/admins');
const ordersRouter = require('../routes/orders');
const inventoryRouter = require('../routes/inventory');
const walletsRouter = require('../routes/wallets');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://medialiftadvisor_db_user:BAtPdcQ31WhUdWSs@mla.ab5rsbm.mongodb.net/?appName=mla';

const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB()
  .then(() => console.log('MongoDB Database Connected Successfully! 🟢'))
  .catch((err) => console.log('MongoDB Connection Error: 🔴', err));

app.use('/api/users', usersRouter);
app.use('/api/delivery-partners', deliveryPartnersRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/wallets', walletsRouter);

app.get('/', (req, res) => {
  res.send('Mandigo Backend is Live & Running! 🚀');
});

module.exports = app;
