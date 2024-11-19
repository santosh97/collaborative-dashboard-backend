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
const authenticateToken = require('./middleware/auth');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
// CORS configuration
const allowedOrigins = [
    'https://collaborative-dashboard-g9nehck0z-santoshs-projects-5df5e859.vercel.app',
    'https://collaborative-dashboard-santoshs-projects-5df5e859.vercel.app',
    'https://collaborative-dashboard-alpha.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies or credentials to be included in requests
}));

// Rate limiting for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again later.'
});

app.use('/api/', apiLimiter);

// MongoDB Connection using environment variables
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/widgets', require('./routes/widgetRoutes'));

// WebSocket handling with credentials
const io = new Server(server, {
    cors: {
        origin: process.env.SOCKET_URI,  // Allow frontend origin
        credentials: true,  // Allow credentials (cookies, authorization tokens)
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle widget creation, update, and deletion events
    socket.on('widget:create', (widget) => {
        io.emit('widget:created', widget); // Broadcast to all clients
    });

    socket.on('widget:update', (updatedWidget) => {
        console.log('widget:update:', updatedWidget);
        io.emit('widget:updated', updatedWidget);
    });

    socket.on('widget:delete', (widgetId) => {
        io.emit('widget:deleted', widgetId);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
