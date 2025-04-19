// /pages/api/data.js

  const mongoose = require("mongoose");
  const logger=require('./logger')
// /pages/api/data.js
const connectDB = async () => {
//   if (mongoose.connections[0].readyState) return;


logger.info('mongoose function is funning')
  await mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    logger.info('MongoDB Connected');
  });

  mongoose.connection.on("error", (err) => {
    logger.error('MongoDB connection error: ${err.message')
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn('MongoDB Disconnected');
  })

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      logger.warn('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  });
};

module.exports={
    connectDB
 } ;
