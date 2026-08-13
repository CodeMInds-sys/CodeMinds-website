// Environment and core dependencies
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Database and utilities
const connectMongoose = require("./utils/connectMongoose");
const Logger = require("./utils/logger");
const passport = require("./passport");
  
// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
  
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

// Logging middleware
app.use((req, res, next) => {
  Logger.info(`${req.method} ${req.path}`, { 
    query: req.query, 
    body: req.body, 
    ip: req.ip 
  });
  next();
});

// Import route handlers
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
    
// Static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
   
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maleForms", require("./routes/male"));


// 404 Handler
app.get("*", (req, res) => {
  Logger.info("Root endpoint accessed");
  res.send("not found api");
});
  
const dns = require('dns');

// dns.setDefaultResultOrder('ipv4first');
// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  Logger.error("Server Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Send error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "حدث خطأ في الخادم",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Database connection and server startup
(async () => {
  try {
    await connectMongoose.connectDB();
    app.listen(port, () => {
      Logger.info(`  Server is running on port ${port}`);
    });
  } catch (error) {
    Logger.error("Failed to start server:", {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
})();


module.exports = app;
  

 
     