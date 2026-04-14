const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Paths check (Dhyan rakhein ki folders ke naam exact yahi hain)
const usersRouter = require('./routes/users');
const deliveryPartnersRouter = require('./routes/deliveryPartners');
const adminsRouter = require('./routes/admins');
const ordersRouter = require('./routes/orders');
const inventoryRouter = require('./routes/inventory');
const walletsRouter = require('./routes/wallets');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Pehle MONGO_URI define hona chahiye
const mongoURI = process.env.MONGO_URI;

// 2. Connection Logic (Cleaned up)
const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!mongoURI) {
        console.error("❌ ERROR: MONGO_URI is missing in Vercel settings!");
        throw new Error("MONGO_URI is undefined");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoURI).then((mongooseInstance) => {
            console.log("🚀 SUCCESS: MongoDB Connected Successfully");
            return mongooseInstance;
        }).catch((err) => {
            console.error("❌ MongoDB Connection Error:", err.message);
            throw err;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// 3. Routes setup se pehle DB call
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database connection failed", details: err.message });
    }
});

app.use('/api/users', usersRouter);
app.use('/api/delivery-partners', deliveryPartnersRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/wallets', walletsRouter);

app.get('/', (req, res) => {
    res.send('Sevzo Backend is Live & Running! 🚀');
});

// Port settings
const port = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Sevzo Backend listening on port ${port}`);
    });
}

module.exports = app;