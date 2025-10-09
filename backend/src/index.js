import express from 'express'
import dotemv from 'dotenv'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from './lib/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotemv.config()
const app = express();
app.use(cors())
app.use(cookieParser())
app.use(express.json())
const PORT = process.env.PORT || 3002
app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);
app.listen(PORT,()=>{console.log("server is running on "+PORT)
    connectDB()
})