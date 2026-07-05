import mongoose from "mongoose";

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = "mongodb://127.0.0.1:27017/thumbly";

  mongoose.connection.on("connected", () => console.log("MongoDB connected successfully"));
  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error event emitted:", err.message || err);
  });

  try {
    if (primaryUri) {
      console.log("Connecting to primary MongoDB URI...");
      await mongoose.connect(primaryUri);
    } else {
      console.log("No primary MONGODB_URI found, using local fallback...");
      await mongoose.connect(fallbackUri);
    }
  } catch (error: any) {
    console.error("Failed to connect to primary MongoDB:", error.message || error);
    if (primaryUri) {
      console.log("Disconnecting primary attempt and attempting local fallback...");
      try {
        await mongoose.disconnect();
        await mongoose.connect(fallbackUri);
      } catch (fallbackError: any) {
        console.error("Local fallback MongoDB connection also failed:", fallbackError.message || fallbackError);
      }
    }
  }
};

export default connectDB;
