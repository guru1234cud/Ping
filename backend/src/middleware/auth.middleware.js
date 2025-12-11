import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - no token provided"})
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({message:"Unauthorized - token expired"})
            }
            return res.status(401).json({message:"Unauthorized - invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        req.user = user;

        next();
    }
    catch(err){
        console.error("Auth middleware error:", err);
        res.status(500).json({message:"Internal server error"})
    }
}