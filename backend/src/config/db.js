import mongoose from "mongoose"
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB Connected")
    } catch (error) {
        console.error("Error connecting to MONGODB:" , error);
        process.exit(1) // 1 means exit with failure 0 means success
    }
}