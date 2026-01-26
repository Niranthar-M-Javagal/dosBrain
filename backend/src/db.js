import mongoose from "mongoose";
import ENV from "../src/lib/env.js";


const connectDB = async () => {
    try{
        const conn = await mongoose.connect(ENV.db_url);
        console.log("Database connected successfully");
    }
    catch(error){
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;