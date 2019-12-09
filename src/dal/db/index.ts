import mongoose from "mongoose";

export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      useNewUrlParser: true,
    });

    console.log("Connected succesfully to MongoDB database...");
  } catch (err) {
    throw new Error("Failed to connect to database: " + err.message);
  }
}

export default mongoose;
