import cloudinary from '../lib/cloudinary.js'
import { generatetoken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from "bcryptjs"
export const login = async (req, res) => {
    const {email, password } = req.body
    try {
        if(!email || !password){
            res.status(400).json({ message: "all fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least of 6 characters" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }
        const ispassowrdcrt = await bcrypt.compare(password, user.password)
        if (!ispassowrdcrt) {
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
        res.status(500).json({ message: "Internal server error" })
    }
}
export const signup = async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        if (!fullname || !email || !password) {
            console.log(req.body);
            
            res.status(400).json({ message: "all fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least of 6 characters" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Email already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname: fullname,
            email: email,
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
                createdAt:user.createdAt
            })
        }
        else {
            res.status(400).json({ message: "problem in creating the user" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
}
export const logout = (req, res) => {
    try{
    console.log("searching jwt...");
    
    res.cookie("jwt","",{maxAge:0})
    return res.status(200).json({message:"logged out successfully"})
    }
    catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req,res)=>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id

        if(!profilePic) {
            return res.status(400).json({message:"profie pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        console.log(uploadResponse);
        
        const updatedUser = await User.findByIdAndUpdate(userId, {profilepic:uploadResponse.secure_url}, {new:true}).select("-password");
        console.log(updatedUser);
        
        res.status(200).json({updatedUser})
    }catch(err){
        console.log("err from profile",err);
        res.status(500).json({message:"Internal server error"})
    }
}
export const checkAuth = (req,res)=>{
    try{
        res.json(req.user).status(200);
    }catch(err){
        console.log("error in checkauth", err);
        res.status(500).json({message:"Internal server error"})
    }

}