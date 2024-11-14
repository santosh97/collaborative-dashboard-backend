'use strict';
/*******
 * server.js: entry point for app
 * 
 * 11/2024 Santosh Dubey
 *
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const widgetRoutes = require('./routes/widgetRoutes');
const authenticateToken = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Middleware
app.use(express.json());
// app.set('trust proxy', true);
// CORS configuration
const allowedOrigins = ['https://collaborative-dashboard-bm7lll42v-santoshs-projects-5df5e859.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// Rate limiting for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again later.'
});

app.use('/api/', apiLimiter);

// MongoDB Connection using environment variables
mongoose.connect(process.env.MONGO_URI, {

}).then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));

// Routes
app.use('/api', widgetRoutes);

// WebSocket handling
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
