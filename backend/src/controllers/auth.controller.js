import cloudinary from '../lib/cloudinary.js'
import { generatetoken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from "bcryptjs"
export const login = async (req, res) => {
    const {email, password } = req.body
    try {
        if(!email || !password){
            return res.status(400).json({ message: "all fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least of 6 characters" })
        }

        const trimmedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: trimmedEmail })
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "invalid credentials" })
        }
        generatetoken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilepic: user.profilepic,
            createdAt:user.createdAt
        })

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const signup = async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "all fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least of 6 characters" })
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedFullname = fullname.trim();

        const user = await User.findOne({ email: trimmedEmail })
        if (user) {
            return res.status(400).json({ message: "Email already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname: trimmedFullname,
            email: trimmedEmail,
            password: hashedpassword
        })
        if (newUser) {
            generatetoken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilepic: newUser.profilepic,
                createdAt:newUser.createdAt
            })
        }
        else {
            return res.status(400).json({ message: "problem in creating the user" })
        }
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0})
        return res.status(200).json({message:"logged out successfully"})
    }
    catch(err){
        console.error("Logout error:", err);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req,res)=>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id

        if(!profilePic) {
            return res.status(400).json({message:"profile pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "ping_profiles",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
            transformation: [
                { width: 500, height: 500, crop: "limit" },
                { quality: "auto" }
            ]
        })

        const updatedUser = await User.findByIdAndUpdate(userId, {profilepic:uploadResponse.secure_url}, {new:true}).select("-password");

        res.status(200).json(updatedUser)
    }catch(err){
        console.error("Update profile error:", err);
        res.status(500).json({message:"Internal server error"})
    }
}
export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.error("Check auth error:", err);
        res.status(500).json({message:"Internal server error"})
    }
}