import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = new mongoose.Types.ObjectId(req.user._id);
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password")
        console.log(filteredUsers);
        res.status(200).json(filteredUsers)
    } catch (err) {
        console.log("error form sidebaruserget:", err);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages)
    } catch(err) {
        console.log("error form message get:", err);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req,res)=>{
    try{
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id 

        let imageurl;
        if (image){
            const uploaderResponse = await cloudinary.uploader.upload(image);
            imageurl = uploaderResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageurl
        })
        await newMessage.save();
        const ReceiverSocketId = getReceiverSocketId(receiverId)
        if (ReceiverSocketId){
            io.to(ReceiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage)
    }catch(err){
                console.log("error form send message:",err);
        res.status(500).json({message:"Internal server error"})
    }
}