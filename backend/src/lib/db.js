import mongoose from 'mongoose'

export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB conection is successful with host "+conn.connection.host);
    }
    catch(err){
        console.log(err);
    }
}