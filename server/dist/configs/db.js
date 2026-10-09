import mongoose from "mongoose";
let isConnecting = false;
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    if (isConnecting) {
        // Wait for in-flight connection
        while (mongoose.connection.readyState === 2) {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
        return;
    }
    const primaryUri = process.env.MONGODB_URI;
    const fallbackUri = "mongodb://127.0.0.1:27017/thumbly";
    isConnecting = true;
    try {
        if (primaryUri) {
            console.log("Connecting to primary MongoDB URI...");
            await mongoose.connect(primaryUri, {
                bufferCommands: false,
            });
            console.log("MongoDB connected successfully");
        }
        else {
            console.log("No primary MONGODB_URI found, using local fallback...");
            await mongoose.connect(fallbackUri, {
                bufferCommands: false,
            });
            console.log("Connected to local MongoDB");
        }
    }
    catch (error) {
        console.error("Failed to connect to primary MongoDB:", error.message || error);
        if (primaryUri && process.env.NODE_ENV !== "production") {
            console.log("Attempting local fallback MongoDB connection...");
            try {
                await mongoose.disconnect();
                await mongoose.connect(fallbackUri, {
                    bufferCommands: false,
                });
                console.log("Connected to local fallback MongoDB");
            }
            catch (fallbackError) {
                console.error("Local fallback MongoDB connection failed:", fallbackError.message || fallbackError);
            }
        }
    }
    finally {
        isConnecting = false;
    }
};
export default connectDB;
