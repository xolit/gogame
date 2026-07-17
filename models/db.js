const mongoose = require("mongoose");

const getMongoUri = () => {
  return (
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL ||
    ""
  );
};

const connectDB = async () => {
  const uri = getMongoUri();

  if (!uri) {
    console.warn(
      "No MongoDB connection string found. Skipping MongoDB connection.",
    );
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    });
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return null;
  }
};

module.exports = connectDB;
