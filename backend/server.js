const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// CORS — allow all origins (safe for this project)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route — fixes "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ message: 'TaskPlanet Social API is running ✅' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskPlanet Social API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });