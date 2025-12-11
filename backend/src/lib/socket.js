import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000', 'http://localhost:5173'];

const io = new Server(server,{
    cors:{
        origin: allowedOrigins,
        credentials: true
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket)=>{
    console.log("User connected:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined"){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineusers",Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineusers",Object.keys(userSocketMap));
    })
})

export {server,app,io};