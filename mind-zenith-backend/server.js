const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import database connection
const connectDB = require('./src/config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to test if server is working
app.get('/', (req, res) => {
    res.json({ message: 'Mind Zenith Backend is running!' });
});

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/journals', require('./src/routes/journalRoutes'));
app.use('/api/daily-logs', require('./src/routes/dailyLogRoutes'));
app.use('/api/quizzes', require('./src/routes/quizRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});