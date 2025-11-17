import express from 'express'
import dotemv from 'dotenv'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from './lib/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import {app, server} from './lib/socket.js'
dotemv.config()

app.use(cors({
        origin:"*",
        credentials:false}
))
app.use(cookieParser())
app.use(express.json())
const PORT = process.env.PORT || 3002
app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);
server.listen(PORT,()=>{console.log("server is running on "+PORT)
    connectDB()
})