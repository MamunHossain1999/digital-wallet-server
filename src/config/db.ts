import mongoose from "mongoose";


export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB connect successfully")

    }catch (err) {
        console.log("DB connection failed");
        process.exit(1);
    }
}