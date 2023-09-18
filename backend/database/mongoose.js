import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch(() => console.log("Cannot connect to MongoDB"));
};

export default connectDatabase;
