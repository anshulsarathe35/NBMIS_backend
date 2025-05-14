// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const saleRoutes = require('./routes/saleRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const reportRoutes = require('./routes/reportRoutes');
const districtRoutes = require('./routes/districtRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sale', saleRoutes);
app.use('/api/receipt', receiptRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/district', districtRoutes);
app.use('/api/admin', userRoutes)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
