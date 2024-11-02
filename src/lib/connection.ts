import { connect, disconnect } from "mongoose";

export async function connectDB(){
    try {
        await connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

    } catch (error) {
        throw new Error("Connection Failed");
    }
}

export async function disconnectDB(){
    try {
        await disconnect();
    } catch (error) {
        throw new Error("Disconnection Failed");        
    }
}