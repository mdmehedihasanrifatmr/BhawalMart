import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully.");
    }catch(e){
        console.log("Something went wrong.");
    }
}