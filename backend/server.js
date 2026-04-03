require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ IMPORTANT
const connectDB = require('./config/db');
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const paymentRoutes  = require("./routes/payment");
const categoryProductRoutes = require("./routes/categoryRoutes");

connectDB();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Serve Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/product'));
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", categoryProductRoutes);
app.use('/api/users', require('./routes/userRoutes'));

// ✅ Server
app.listen(5000, () => console.log('Server running on port 5000'));