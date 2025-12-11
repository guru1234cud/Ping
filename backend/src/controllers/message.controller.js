import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = new mongoose.Types.ObjectId(req.user._id);
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (err) {
        console.error("Error getting sidebar users:", err);
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
        }).sort({ createdAt: 1 })
        res.status(200).json(messages)
    } catch(err) {
        console.error("Error getting messages:", err);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req,res)=>{
    try{
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id

        // Validate that message has content
        if (!text && !image) {
            return res.status(400).json({message:"Message must contain text or image"})
        }

        let imageurl;
        if (image){
            const uploaderResponse = await cloudinary.uploader.upload(image, {
                folder: "ping_messages",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
                transformation: [
                    { width: 1000, height: 1000, crop: "limit" },
                    { quality: "auto" }
                ]
            });
            imageurl = uploaderResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || "",
            image:imageurl
        })
        await newMessage.save();
        const ReceiverSocketId = getReceiverSocketId(receiverId)
        if (ReceiverSocketId){
            io.to(ReceiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage)
    }catch(err){
        console.error("Error sending message:", err);
        res.status(500).json({message:"Internal server error"})
    }
}