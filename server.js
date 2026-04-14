const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRouter = require('./routes/users');
const deliveryPartnersRouter = require('./routes/deliveryPartners');
const adminsRouter = require('./routes/admins');
const ordersRouter = require('./routes/orders');
const inventoryRouter = require('./routes/inventory');
const walletsRouter = require('./routes/wallets');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://medialiftadvisor_db_user:ZTyxx80DLkzTf2g5@ac-3ormxhn-shard-00-00.ab5rsbm.mongodb.net:27017,ac-3ormxhn-shard-00-01.ab5rsbm.mongodb.net:27017,ac-3ormxhn-shard-00-02.ab5rsbm.mongodb.net:27017/?ssl=true&replicaSet=atlas-tt5ccd-shard-0&authSource=admin&appName=test';

const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI).then((mongooseInstance) => {
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
  res.send('Sevzo Backend is Live & Running! 🚀');
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Sevzo Backend listening on port ${port}`);
  });
}

module.exports = app;
