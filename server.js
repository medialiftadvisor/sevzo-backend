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
// server.js mein connection wala hissa aise likhein:

const mongoURI = process.env.MONGO_URI;

// Debugging Log: Ye check karne ke liye ki Vercel ko link mil bhi raha hai ya nahi
console.log("Checking MONGO_URI setup...");
if (!mongoURI) {
    console.error("❌ ERROR: MONGO_URI is undefined! Vercel settings check karein.");
} else {
    // Link ke shuruat ke kuch akshar print karega bina password dikhaye
    console.log("✅ MONGO_URI found. Starting with:", mongoURI.substring(0, 15));
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log("🚀 SUCCESS: MongoDB Connected to Sevzo Database");
  })
  .catch((err) => {
    console.error("❌ CONNECTION FAILED:");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message); // Yahan asli wajah likhi aayegi
    
    if (err.message.includes("authentication failed")) {
        console.error("👉 Advice: Password galat hai ya username sahi nahi hai.");
    } else if (err.message.includes("buffering timed out")) {
        console.error("👉 Advice: IP Whitelist (0.0.0.0/0) ka chakkar hai.");
    }
  });
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
