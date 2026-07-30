import mongoose from "mongoose";
import 'dotenv/config'

const connectDB= async ()=>{
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI not set. Running GreenCart API in demo mode.");
        return false;
    }

    try{
        mongoose.connection.on('connected',()=>{
            console.log("Database connected");
            
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/greatcart`)
        return true;
    }
    catch(error){
        console.log(error.message);
        return false;
    }
}


export default connectDB
