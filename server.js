const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan'); 
const authRoutes = require('./routes/authRoutes');

//LOADING ENVIRONMENT VARIABLES
dotenv.config();

const app =express();

//MIDDLEWARE
app.use(morgan('dev')); 
app.use(cors());
app.use(express.json());

//ROUTES
app.use('/api/auth', authRoutes);

//BASIC ROUTE
app.get('/api/welcome', (req, res) => {
  res.json({ message: 'Welcome to your E-Commerce API' });
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected');
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

//START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});