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
        })

    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
}
export const signup = async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        if (!fullname || !email || !password) {
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
                profilepic: newUser.profilepic
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
    res.cookie("jwt","",{maxAge:0})
    }
    catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (req,res)=>{
    
}