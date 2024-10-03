import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/${process.env.DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

export const connectDB = async () => {
  try {
    console.log("mongo_uri: ", dbUrl);
    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${dbUrl}`);
  } catch (error) {
    console.log("Error connection to MongoDB: ", error.message);
    process.exit(1);
  }
};
