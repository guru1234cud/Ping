import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from './lib/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {app, server} from './lib/socket.js'
dotenv.config()

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
        origin: allowedOrigins,
        credentials: true
}))
app.use(cookieParser())
app.use(express.json({limit: '10mb'}))
const PORT = process.env.PORT || 3002

app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);

// Connect to database first, then start server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});