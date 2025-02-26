require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('❌ Error: Missing JWT_SECRET in .env file');
  process.exit(1); // Exit if no secret is found
}

// Connect to MongoDB with error handling
mongoose
  .connect('mongodb://127.0.0.1:27017/auth_demo')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Use authentication routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
